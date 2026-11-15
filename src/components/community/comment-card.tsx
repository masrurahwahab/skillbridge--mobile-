import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';

type CommentCardProps = {
  name: string;
  avatarUrl?: string;
  timeAgo: string;
  content: string;
};

export function CommentCard({ name, avatarUrl, timeAgo, content }: CommentCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar name={name} uri={avatarUrl} size={32} />
        <View style={styles.identity}>
          <AppText variant="bodySmall" weight="700">
            {name}
          </AppText>
          <AppText variant="caption" color={Palette.textMuted}>
            {timeAgo}
          </AppText>
        </View>
      </View>
      <AppText variant="bodySmall" color={Palette.text}>
        {content}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  identity: {
    flex: 1,
    gap: 1,
  },
});
