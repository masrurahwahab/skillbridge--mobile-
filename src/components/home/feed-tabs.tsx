import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';
import type { FeedTab } from '@/types';

const TABS: { key: FeedTab; label: string }[] = [
  { key: 'for-you', label: 'For You' },
  { key: 'trending', label: 'Trending' },
  { key: 'following', label: 'Following' },
];

type FeedTabsProps = {
  value: FeedTab;
  onChange: (tab: FeedTab) => void;
};

export function FeedTabs({ value, onChange }: FeedTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = tab.key === value;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.key)}
            style={styles.tab}>
            <View style={styles.labelRow}>
              <AppText
                variant="subtitle"
                weight={active ? '700' : '500'}
                color={active ? Palette.primary : Palette.textMuted}>
                {tab.label}
              </AppText>
              {active ? <View style={styles.dot} /> : null}
            </View>
            <View style={[styles.indicator, active && styles.indicatorActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  tab: {
    paddingTop: 10,
    gap: Spacing.two,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.accent,
  },
  indicator: {
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.transparent,
  },
  indicatorActive: {
    backgroundColor: Palette.primary,
  },
});
