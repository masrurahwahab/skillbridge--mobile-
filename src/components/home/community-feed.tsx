import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import type { CommunityPost } from '@/types';

import { PostCard } from './post-card';

type CommunityFeedProps = {
  posts: CommunityPost[];
  onAction: (post: CommunityPost) => void;
  onLike?: (post: CommunityPost) => void;
  onComment?: (post: CommunityPost) => void;
};

export function CommunityFeed({ posts, onAction, onLike, onComment }: CommunityFeedProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="subtitle" weight="700">
          Community Feed
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Latest shares
        </AppText>
      </View>

      {posts.length === 0 ? (
        <Card>
          <AppText variant="body" color={Palette.textMuted} align="center">
            No posts in this feed yet. Try another tab.
          </AppText>
        </Card>
      ) : (
        <View style={styles.posts}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onAction={onAction}
              onLike={onLike}
              onComment={onComment}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.three,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  posts: {
    gap: Spacing.three,
  },
});
