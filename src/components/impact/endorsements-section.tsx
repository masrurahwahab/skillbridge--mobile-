import { Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { Endorsement } from '@/types';

type EndorsementsSectionProps = {
  endorsements: Endorsement[];
};

export function EndorsementsSection({ endorsements }: EndorsementsSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="subtitle" weight="700">
          Recent Endorsements
        </AppText>
        <AppText variant="caption" color={Palette.textMuted}>
          {endorsements.length} this week
        </AppText>
      </View>

      <View style={styles.list}>
        {endorsements.map((endorsement) => (
          <Card key={endorsement.id} style={styles.card}>
            <View style={styles.personRow}>
              <Avatar
                name={endorsement.author.name}
                uri={endorsement.author.avatarUrl}
                size={38}
              />
              <View style={styles.personInfo}>
                <AppText variant="bodySmall" weight="700" numberOfLines={1}>
                  {endorsement.author.name}
                </AppText>
                <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                  {endorsement.author.role} · {endorsement.timeAgo}
                </AppText>
              </View>
              <View style={styles.rating}>
                <Star color={Palette.warning} fill={Palette.warning} size={13} />
                <AppText variant="caption" color={Palette.warningText} weight="700">
                  {endorsement.rating.toFixed(1)}
                </AppText>
              </View>
            </View>

            <AppText variant="body" color={Palette.text}>
              “{endorsement.quote}”
            </AppText>

            <View style={styles.skillPill}>
              <AppText variant="caption" color={Palette.primary} weight="700">
                {endorsement.skill}
              </AppText>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    gap: 10,
    padding: 14,
    borderRadius: Radius.xl,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  personInfo: {
    flex: 1,
    gap: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.warningSoft,
  },
  skillPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.lavender,
  },
});
