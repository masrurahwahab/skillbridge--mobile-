import { MessageCircle, Repeat2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Palette, Radius } from '@/constants/theme';
import type { CommunityPostDto } from '@/types/api';
import { handleForName } from '@/utils/skills';
import { formatRelativeTime } from '@/utils/time';

type DiscussionSectionProps = {
  post?: CommunityPostDto;
  onPress: () => void;
};

export function DiscussionSection({ post, onPress }: DiscussionSectionProps) {
  if (!post) return null;

  return (
    <View style={styles.section}>
      <AppText variant="subtitle" weight="700">
        Relevant Discussions
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open discussion: ${post.content}`}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}>
        <Card padded={false} style={styles.card}>
          <View style={styles.header}>
            <Avatar name={post.author.name} uri={post.author.avatarUrl} size={32} />
            <View style={styles.headerText}>
              <AppText variant="bodySmall" weight="700">
                {post.author.name}
              </AppText>
              <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                {handleForName(post.author.name)} in{' '}
                <AppText variant="caption" color={Palette.primary} weight="600">
                  {post.category}
                </AppText>{' '}
                · {formatRelativeTime(post.createdAt)}
              </AppText>
            </View>
          </View>

          <AppText variant="body" style={styles.question} numberOfLines={4}>
            {post.content}
          </AppText>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <MessageCircle color={Palette.textMuted} size={15} strokeWidth={2} />
              <AppText variant="caption" color={Palette.textMuted} weight="600">
                {post.commentsCount} replies
              </AppText>
            </View>
            <View style={styles.metaItem}>
              <Repeat2 color={Palette.accent} size={15} strokeWidth={2} />
              <AppText variant="caption" color={Palette.accent} weight="600">
                {post.likesCount} upvotes
              </AppText>
            </View>
          </View>
        </Card>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  card: {
    padding: 14,
    borderRadius: Radius.xl,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  question: {
    lineHeight: 21,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
    rowGap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pressed: {
    opacity: 0.85,
  },
});
