import { TrendingUp } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { TrendingSkill } from '@/types';

const TONE_COLORS: Record<TrendingSkill['tone'], string> = {
  accent: Palette.accent,
  success: Palette.success,
  primary: Palette.primary,
  warning: '#D97706',
};

type TrendingSectionProps = {
  skills: TrendingSkill[];
};

export function TrendingSection({ skills }: TrendingSectionProps) {
  if (skills.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Trending Skills & Discussions"
        icon={TrendingUp}
        iconColor="#D97706"
      />
      <View style={styles.grid}>
        {skills.map((skill) => (
          <Card key={skill.id} padded={false} style={styles.card}>
            <AppText variant="caption" weight="700" color={TONE_COLORS[skill.tone]}>
              {skill.rank}
            </AppText>
            <AppText variant="subtitle" weight="700" numberOfLines={1} style={styles.title}>
              {skill.title}
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted}>
              {skill.meta}
            </AppText>
          </Card>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.three,
    gap: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 140,
    padding: 12,
    borderRadius: Radius.xl,
    gap: 2,
  },
  title: {
    marginBottom: 2,
  },
});
