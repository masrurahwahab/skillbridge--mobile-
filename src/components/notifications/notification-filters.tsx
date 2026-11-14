import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { notificationFilters } from '@/constants/content';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { NotificationFilterKey } from '@/types';

type NotificationFiltersProps = {
  value: NotificationFilterKey;
  swapCount: number;
  unreadCount: number;
  onChange: (value: NotificationFilterKey) => void;
};

export function NotificationFilters({
  value,
  swapCount,
  unreadCount,
  onChange,
}: NotificationFiltersProps) {
  return (
    <View style={styles.container}>
      {notificationFilters.map((filter) => {
        const active = filter.id === value;
        const label =
          filter.id === 'swaps' && swapCount > 0
            ? `${filter.label} (${swapCount})`
            : filter.label;

        return (
          <View key={filter.id} style={styles.tabItem}>
            <AppText
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onChange(filter.id)}
              variant="bodySmall"
              color={active ? Palette.primary : Palette.textMuted}
              weight={active ? '700' : '500'}
              numberOfLines={1}
              align="center"
              style={[styles.label, active && styles.activeLabel]}>
              {label}
              {filter.id === 'all' && unreadCount > 0 ? ' •' : ''}
            </AppText>
            <View style={[styles.indicator, active && styles.activeIndicator]} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    width: '100%',
    paddingBottom: 8,
    borderRadius: Radius.sm,
  },
  activeLabel: {
    color: Palette.primary,
  },
  indicator: {
    width: '100%',
    height: 2,
    borderRadius: Radius.full,
    backgroundColor: Palette.transparent,
  },
  activeIndicator: {
    backgroundColor: Palette.primary,
  },
});
