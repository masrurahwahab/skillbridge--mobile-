import { Check, TrendingUp } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SkillDetail } from '@/types';

type SkillOverviewCardProps = {
  skill: SkillDetail;
};

export function SkillOverviewCard({ skill }: SkillOverviewCardProps) {
  const Icon = SKILL_ICONS[skill.icon];

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconTile}>
          <Icon color={Palette.primary} size={30} strokeWidth={2} />
        </View>
        <View style={styles.demandBadge}>
          <TrendingUp color={Palette.success} size={13} strokeWidth={2.4} />
          <AppText variant="caption" color={Palette.success} weight="700" numberOfLines={1}>
            {skill.demandLabel}
          </AppText>
        </View>
      </View>

      <View style={styles.titleGroup}>
        <AppText variant="overline" color={Palette.accent}>
          {skill.category.toUpperCase()}
        </AppText>
        <AppText variant="headlineSmall" weight="700">
          {skill.title}
        </AppText>
        <AppText variant="body" color={Palette.textMuted}>
          {skill.description}
        </AppText>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <AppText variant="headlineSmall" weight="700" color={Palette.primary}>
            {skill.teachesCount}
          </AppText>
          <AppText variant="caption" color={Palette.textMuted} weight="600">
            Teachers
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <AppText variant="headlineSmall" weight="700" color={Palette.primary}>
            {skill.learnersCount}
          </AppText>
          <AppText variant="caption" color={Palette.textMuted} weight="600">
            Learners
          </AppText>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <AppText variant="headlineSmall" weight="700" color={Palette.primary}>
            {skill.relatedSkills.length}
          </AppText>
          <AppText variant="caption" color={Palette.textMuted} weight="600">
            Related skills
          </AppText>
        </View>
      </View>

      <View style={styles.highlights}>
        {skill.highlights.map((highlight) => (
          <View key={highlight} style={styles.highlight}>
            <Check color={Palette.accent} size={13} strokeWidth={2.5} />
            <AppText variant="caption" color={Palette.text} weight="600">
              {highlight}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three + Spacing.one,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  iconTile: {
    width: 58,
    height: 58,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.lavender,
  },
  demandBadge: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.successSoft,
  },
  titleGroup: {
    gap: 5,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Palette.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: Palette.border,
  },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
  },
});
