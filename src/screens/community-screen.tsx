import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryFilterBar } from '@/components/community/category-filter-bar';
import { CommunityHeader } from '@/components/community/community-header';
import { CommunityPostCard } from '@/components/community/community-post-card';
import { PostComposerModal } from '@/components/community/post-composer-modal';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { postsService } from '@/services/posts.service';
import type { CommunityPostExtended, PostCategory } from '@/types';
import { toCommunityPost } from '@/utils/community';

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [posts, setPosts] = useState<CommunityPostExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const fetchPosts = useCallback(async () => {
    setError(null);
    try {
      const res = await postsService.list({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        pageSize: 30,
      });
      setPosts(res.items.map(toCommunityPost));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load community posts.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, user?.id]);

  useEffect(() => {
    setLoading(true);
    void fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  const promptSignIn = (title: string, message: string) => {
    Alert.alert(title, message, [
      { text: 'Keep browsing', style: 'cancel' },
      { text: 'Sign in', onPress: () => router.push('/welcome') },
    ]);
  };

  const openComposer = () => {
    if (!user) {
      promptSignIn('Sign in to post', 'Join SkillBridge to start a discussion or share a project.');
      return;
    }
    setShowComposer(true);
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      promptSignIn('Sign in to like posts', 'Join SkillBridge to react to community posts.');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    try {
      await postsService.toggleLike(postId);
    } catch {
      await fetchPosts();
    }
  };

  const handleSave = (postId: string) => {
    if (!user) {
      promptSignIn('Sign in to save posts', 'Create an account to keep community posts for later.');
      return;
    }

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, saved: !p.saved } : p))
    );
  };

  const openThread = (postId: string) => {
    router.push({ pathname: '/post/[id]', params: { id: postId } });
  };

  const handleAction = (post: CommunityPostExtended) => {
    openThread(post.id);
  };

  const handlePublish = async (text: string, category: PostCategory) => {
    if (!user) {
      promptSignIn('Sign in to post', 'Create an account to post in the community.');
      return;
    }

    try {
      await postsService.create(category, text);
      setShowComposer(false);
      if (selectedCategory !== 'all' && selectedCategory !== category) {
        setSelectedCategory(category);
      } else {
        await fetchPosts();
      }
    } catch (err) {
      Alert.alert(
        'Could not publish',
        err instanceof Error ? err.message : 'Please try again in a moment.'
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <CommunityHeader onPost={openComposer} hasUnread={false} />

      <CategoryFilterBar selected={selectedCategory} onSelect={setSelectedCategory} />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Loading community conversations...
          </AppText>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CommunityPostCard
              post={item}
              onLike={handleLike}
              onSave={handleSave}
              onComment={openThread}
              onAction={handleAction}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[Palette.primary]}
              tintColor={Palette.primary}
            />
          }
          ListEmptyComponent={
            <Card style={styles.state}>
              <AppText variant="subtitle" weight="700">
                {error ? 'Community unavailable' : 'No posts yet'}
              </AppText>
              <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                {error ?? 'Be the first to start a conversation in this category.'}
              </AppText>
              {error ? <Button label="Try again" size="sm" onPress={fetchPosts} /> : null}
            </Card>
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <PostComposerModal
        visible={showComposer}
        onClose={() => setShowComposer(false)}
        onPublish={handlePublish}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  listContent: {
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six + 40,
    flexGrow: 1,
  },
  state: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    marginHorizontal: Spacing.three,
  },
});
