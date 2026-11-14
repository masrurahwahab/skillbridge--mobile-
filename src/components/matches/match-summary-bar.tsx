import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';

type MatchSummaryBarProps = {
  total: number;
  sortLabel: string;
};

export function MatchSummaryBar({ total, sortLabel }: MatchSummaryBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.summary}>
        <View style={styles.pulseHalo}>
          <View style={styles.pulseDot} />
        </View>
        <AppText variant="caption" weight="700" numberOfLines={1} style={styles.summaryText}>
          {total} High-Compatibility Matches
        </AppText>
      </View>
      <AppText
        variant="caption"
        color={Palette.textMuted}
        numberOfLines={1}
        style={styles.sortLabel}>
        {sortLabel}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    backgroundColor: Palette.background,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  summary: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseHalo: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.successSoft,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.success,
  },
  summaryText: {
    flexShrink: 1,
  },
  sortLabel: {
    flexShrink: 0,
  },
});
