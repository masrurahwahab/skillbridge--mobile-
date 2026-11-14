import { MessageCircle, Repeat2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Palette, Radius } from '@/constants/theme';
import type { SearchDiscussion } from '@/types';

type SkillDiscussionCardProps = {
  discussion?: SearchDiscussion;
  onPress: () => void;
};

export function SkillDiscussionCard({ discussion, onPress }: SkillDiscussionCardProps) {
  if (!discussion) return null;

  return (
    <View style={styles.section}>
      <AppText variant="subtitle" weight="700">
        From the Community
      </AppText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open discussion: ${discussion.question}`}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}>
        <Card padded={false} style={styles.card}>
          <View style={styles.header}>
            <Avatar
              name={discussion.author.name}
              uri={discussion.author.avatarUrl}
              size={32}
            />
            <View style={styles.headerText}>
              <AppText variant="bodySmall" weight="700">
                {discussion.author.name}
              </AppText>
              <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                {discussion.category} · {discussion.timeAgo}
              </AppText>
            </View>
          </View>

          <AppText variant="body" style={styles.question}>
            “{discussion.question}”
          </AppText>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <MessageCircle color={Palette.textMuted} size={14} strokeWidth={2} />
              <AppText variant="caption" color={Palette.textMuted} weight="600">
                {discussion.answers} answers
              </AppText>
            </View>
            <View style={styles.metaItem}>
              <Repeat2 color={Palette.accent} size={14} strokeWidth={2} />
              <AppText variant="caption" color={Palette.accent} weight="600">
                {discussion.peerSessions} peer sessions
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
