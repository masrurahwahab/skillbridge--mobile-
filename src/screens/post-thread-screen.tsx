import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CommentCard } from '@/components/community/comment-card';
import { CommentComposer } from '@/components/community/comment-composer';
import { CommunityPostCard } from '@/components/community/community-post-card';
import { ThreadHeader } from '@/components/community/thread-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { postsService } from '@/services/posts.service';
import type { CommunityPostExtended } from '@/types';
import type { PostCommentDto } from '@/types/api';
import { toCommunityPost } from '@/utils/community';
import { formatRelativeTime } from '@/utils/time';

type PostThreadScreenProps = {
  postId?: string;
};

export function PostThreadScreen({ postId }: PostThreadScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [post, setPost] = useState<CommunityPostExtended | null>(null);
  const [comments, setComments] = useState<PostCommentDto[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!postId) {
      setError('This thread could not be found.');
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const [remotePost, remoteComments] = await Promise.all([
        postsService.get(postId),
        postsService.listComments(postId, 1, 50),
      ]);
      setPost(toCommunityPost(remotePost));
      setComments(remoteComments.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this thread.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/community');
  };

  const promptSignIn = (action: string) => {
    Alert.alert(`Sign in to ${action}`, 'Join SkillBridge to reply and react to community threads.', [
      { text: 'Keep reading', style: 'cancel' },
      { text: 'Sign in', onPress: () => router.push('/welcome') },
    ]);
  };

  const toggleLike = async () => {
    if (!post) return;
    if (!user) {
      promptSignIn('like this thread');
      return;
    }

    const nextLiked = !post.isLiked;
    setPost({
      ...post,
      isLiked: nextLiked,
      likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)),
    });
    try {
      await postsService.toggleLike(post.id);
    } catch {
      await load();
    }
  };

  const sendReply = async () => {
    const content = draft.trim();
    if (!postId || !content) return;
    if (!user) {
      promptSignIn('reply');
      return;
    }

    setSending(true);
    try {
      const created = await postsService.addComment(postId, content);
      setComments((current) => [...current, created]);
      setPost((current) =>
        current ? { ...current, comments: current.comments + 1 } : current
      );
      setDraft('');
    } catch (err) {
      Alert.alert(
        'Reply not posted',
        err instanceof Error ? err.message : 'Please try again in a moment.'
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <ThreadHeader title="Thread" onBack={goBack} />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Loading conversation...
          </AppText>
        </View>
      ) : error || !post ? (
        <View style={styles.state}>
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Thread unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error ?? 'This conversation may have been removed.'}
            </AppText>
            <Button label="Try again" size="sm" onPress={load} />
          </Card>
        </View>
      ) : (
        <>
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Palette.primary]}
                tintColor={Palette.primary}
              />
            }
            ListHeaderComponent={
              <View style={styles.headerContent}>
                <CommunityPostCard
                  post={{ ...post, actionLabel: '' }}
                  onLike={toggleLike}
                  onComment={() => {}}
                  onSave={() => promptSignIn('save posts')}
                />
                <View style={styles.repliesHeader}>
                  <AppText variant="subtitle" weight="700">
                    Replies
                  </AppText>
                  <AppText variant="caption" color={Palette.textMuted} weight="600">
                    {comments.length}
                  </AppText>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.commentWrap}>
                <CommentCard
                  name={item.author.name}
                  avatarUrl={item.author.avatarUrl}
                  timeAgo={formatRelativeTime(item.createdAt)}
                  content={item.content}
                />
              </View>
            )}
            ListEmptyComponent={
              <Card style={styles.empty}>
                <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                  No replies yet. Start the conversation.
                </AppText>
              </Card>
            }
          />

          {user ? (
            <View style={{ paddingBottom: insets.bottom }}>
              <CommentComposer
                value={draft}
                sending={sending}
                onChangeText={setDraft}
                onSend={sendReply}
              />
            </View>
          ) : (
            <View style={[styles.guestComposer, { paddingBottom: insets.bottom + Spacing.two }]}>
              <AppText variant="bodySmall" color={Palette.textMuted}>
                Sign in to reply to this thread.
              </AppText>
              <Button label="Sign in" size="sm" onPress={() => router.push('/welcome')} />
            </View>
          )}
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    width: '100%',
  },
  listContent: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    flexGrow: 1,
  },
  headerContent: {
    gap: Spacing.two,
  },
  repliesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  commentWrap: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  empty: {
    alignItems: 'center',
    marginHorizontal: Spacing.three,
    marginTop: Spacing.two,
    padding: Spacing.four,
  },
  guestComposer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
  },
});
