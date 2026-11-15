import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { CommunityFeed } from '@/components/home/community-feed';
import { FeedTabs } from '@/components/home/feed-tabs';
import { HomeHeader } from '@/components/home/home-header';
import { InterestsSection } from '@/components/home/interests-section';
import { PeopleSection } from '@/components/home/people-section';
import { PickedForYouCard } from '@/components/home/picked-for-you-card';
import { TrendingSection } from '@/components/home/trending-section';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { discoverService } from '@/services/discover.service';
import { postsService } from '@/services/posts.service';
import type { CommunityPost, FeedTab, Person, TrendingSkill } from '@/types';
import type { CommunityPostDto, DiscoverDto, DiscoverItemDto } from '@/types/api';
import { handleForName, iconForSkill } from '@/utils/skills';
import { formatRelativeTime } from '@/utils/time';

function toPerson(item: DiscoverItemDto): Person | null {
  if (!item.user) return null;
  const skill = item.skill;
  const icon = iconForSkill(skill?.name ?? '', skill?.category);
  return {
    id: item.user.id,
    name: item.user.name,
    handle: handleForName(item.user.name),
    avatarUrl: item.user.avatarUrl ?? '',
    matchPercent: Math.round(item.score ?? 0),
    teaches: skill?.name ?? item.reason ?? 'Skill exchange',
    wants: item.reason ?? 'Open to swapping skills',
    teachesIcon: icon,
    wantsIcon: icon,
    badge: item.badge,
    badgeTone: item.badge?.toLowerCase().includes('mentor') ? 'teach' : 'success',
  };
}

function toPost(dto: CommunityPostDto, currentUserId?: string): CommunityPost {
  return {
    id: dto.id,
    author: {
      name: dto.author.name,
      handle: handleForName(dto.author.name),
      role: dto.author.location ?? 'Member',
      avatarUrl: dto.author.avatarUrl ?? '',
    },
    timeAgo: formatRelativeTime(dto.createdAt),
    category: dto.category,
    content: dto.content,
    imageUrl: dto.imageUrl,
    likes: dto.likesCount,
    comments: dto.commentsCount,
    actionLabel: 'Join thread',
    trending: dto.likesCount >= 20,
    following: dto.author.id === currentUserId,
    isLiked: dto.isLikedByMe,
  };
}

export function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [feedTab, setFeedTab] = useState<FeedTab>('for-you');
  const [discover, setDiscover] = useState<DiscoverDto | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const postRequest =
        feedTab === 'following'
          ? user
            ? postsService.list({ following: true, pageSize: 10 })
            : Promise.resolve({ items: [], page: 1, pageSize: 10, total: 0 })
          : postsService.list({ pageSize: 10 });
      const [remotePosts, remoteDiscover] = await Promise.all([
        postRequest,
        discoverService.getDiscover(),
      ]);
      setPosts(remotePosts.items.map((item) => toPost(item, user?.id)));
      setDiscover(remoteDiscover);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your discovery feed.');
    } finally {
      setLoading(false);
    }
  }, [feedTab, user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggleLike = async (post: CommunityPost) => {
    if (!user) {
      Alert.alert('Sign in to like posts', 'Join SkillBridge to react and connect with the community.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/welcome') },
      ]);
      return;
    }

    setPosts((current) =>
      current.map((item) =>
        item.id === post.id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.likes + (item.isLiked ? -1 : 1),
            }
          : item
      )
    );
    try {
      await postsService.toggleLike(post.id);
    } catch {
      // The next refresh reconciles with the server.
    }
  };

  const openPerson = (person: Person) => {
    if (!user) {
      Alert.alert('Sign in to connect', 'Join SkillBridge to message and propose a swap.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Sign in', onPress: () => router.push('/welcome') },
      ]);
      return;
    }
    router.push({ pathname: '/swap/[id]', params: { id: person.id } });
  };

  const visiblePosts = posts.filter((post) => {
    if (feedTab === 'trending') return post.trending;
    return true;
  });

  const peopleShelves = (discover?.shelves ?? []).filter(
    (shelf) => shelf.type === 'People' && shelf.items.some((item) => item.user)
  );
  const allPeople = peopleShelves.flatMap((shelf) => shelf.items).map(toPerson).filter(Boolean) as Person[];
  const featured = allPeople[0];
  const featuredShelf = peopleShelves[0];
  const trendingShelf = discover?.shelves.find((shelf) => shelf.type === 'Skills');
  const trendingSkills: TrendingSkill[] = (trendingShelf?.items ?? []).flatMap((item, index) =>
    item.skill
      ? [
          {
            id: String(item.skill.id),
            rank: `#${index + 1}`,
            title: item.skill.name,
            meta: item.reason ?? item.skill.category,
            tone: (['accent', 'success', 'primary', 'warning'] as const)[index % 4],
          },
        ]
      : []
  );

  return (
    <View style={styles.screen}>
      <HomeHeader />
      <FeedTabs value={feedTab} onChange={setFeedTab} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Palette.primary]}
            tintColor={Palette.primary}
          />
        }>
        {loading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Palette.primary} />
            <AppText variant="bodySmall" color={Palette.textMuted}>
              Loading discovery...
            </AppText>
          </View>
        ) : null}

        {!loading && error ? (
          <View style={styles.stateWrap}>
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" weight="700">
                Feed unavailable
              </AppText>
              <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                {error}
              </AppText>
              <Button label="Try again" size="sm" onPress={load} />
            </Card>
          </View>
        ) : null}

        {!loading && !user && !error ? (
          <View style={styles.stateWrap}>
            <Card style={styles.stateCard}>
              <AppText variant="subtitle" weight="700">
                You're browsing as a guest
              </AppText>
              <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                Explore mentors, trending skills, and community posts. Sign in when you're ready to
                connect or start a swap.
              </AppText>
              <Button label="Sign in or join" size="sm" onPress={() => router.push('/welcome')} />
            </Card>
          </View>
        ) : null}

        {user && !loading ? (
          <InterestsSection
            interests={discover?.topInterests ?? []}
            onManage={() => router.push('/onboarding/skills')}
          />
        ) : null}

        {user && !loading && featured ? (
          <PickedForYouCard
            person={featured}
            reason={featuredShelf?.reason}
            onViewMatches={() => router.push('/matches')}
          />
        ) : null}

        {!loading
          ? peopleShelves.map((shelf) => (
              <PeopleSection
                key={shelf.id}
                title={shelf.title}
                subtitle={shelf.reason}
                people={shelf.items.map(toPerson).filter(Boolean) as Person[]}
                onSeeAll={() => router.push(user ? '/matches' : '/welcome')}
                onConnect={openPerson}
              />
            ))
          : null}

        {!loading ? <TrendingSection skills={trendingSkills} /> : null}

        {!loading ? (
          <CommunityFeed
            posts={visiblePosts}
            onLike={toggleLike}
            onComment={(post) =>
              router.push({ pathname: '/post/[id]', params: { id: post.id } })
            }
            onAction={() => router.push('/community')}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  loading: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  stateWrap: {
    paddingHorizontal: Spacing.three,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
