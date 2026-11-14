import { Heart, MessageCircle, Pin } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { ProfilePost } from '@/types';

type PinnedPostCardProps = {
  post: ProfilePost;
  onView: () => void;
};

export function PinnedPostCard({ post, onView }: PinnedPostCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.kicker}>
        {post.pinned ? <Pin color={Palette.accent} size={12} strokeWidth={2.4} /> : null}
        <AppText variant="caption" color={Palette.accent} weight="600">
          {post.kicker}
        </AppText>
      </View>

      <AppText variant="subtitle" weight="700">
        {post.title}
      </AppText>
      <AppText variant="bodySmall" color={Palette.textMuted}>
        {post.body}
      </AppText>

      <View style={styles.footer}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Heart color={Palette.textMuted} size={13} strokeWidth={2} />
            <AppText variant="caption" color={Palette.textMuted}>
              {post.likes} likes
            </AppText>
          </View>
          <View style={styles.stat}>
            <MessageCircle color={Palette.textMuted} size={13} strokeWidth={2} />
            <AppText variant="caption" color={Palette.textMuted}>
              {post.comments} comments
            </AppText>
          </View>
        </View>
        <Button variant="link" size="sm" label="View in Feed" onPress={onView} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: 14,
    borderRadius: Radius.lg,
  },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: 2,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
