import { Globe2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import type { ImpactSummary } from '@/types';

type ImpactHeroCardProps = {
  summary: ImpactSummary;
};

export function ImpactHeroCard({ summary }: ImpactHeroCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.badge}>
        <Globe2 color={Palette.white} size={13} strokeWidth={2.2} />
        <AppText variant="caption" color={Palette.white} weight="700">
          {summary.eyebrow}
        </AppText>
      </View>

      <View style={styles.copy}>
        <AppText variant="headline" color={Palette.white} weight="700">
          {summary.title}
        </AppText>
        <AppText variant="bodySmall" color={Palette.lavender}>
          {summary.description}
        </AppText>
      </View>

      <View style={styles.metrics}>
        {summary.metrics.map((metric) => (
          <View key={metric.id} style={styles.metric}>
            <AppText variant="headlineSmall" color={Palette.white} weight="700">
              {metric.value}
            </AppText>
            <AppText variant="caption" color={Palette.white} weight="700">
              {metric.label}
            </AppText>
            <AppText variant="caption" color={Palette.lavender}>
              {metric.caption}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.xxl,
    backgroundColor: Palette.primaryDark,
    ...Shadows.raised,
  },
  glowOne: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: Palette.secondary,
    opacity: 0.45,
  },
  glowTwo: {
    position: 'absolute',
    bottom: -80,
    left: -60,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: Palette.accent,
    opacity: 0.25,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.overlay,
  },
  copy: {
    gap: 6,
  },
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  metric: {
    width: '48%',
    flexGrow: 1,
    gap: 1,
    padding: 12,
    borderRadius: Radius.lg,
    backgroundColor: Palette.overlaySoft,
    borderWidth: 1,
    borderColor: Palette.overlayBorder,
  },
});
