import { Flame, History, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { popularSearches } from '@/constants/content';
import { Palette, Radius } from '@/constants/theme';
import type { RecentSearch } from '@/types';

type RecentSearchesSectionProps = {
  recent: RecentSearch[];
  onSelect: (value: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
};

export function RecentSearchesSection({
  recent,
  onSelect,
  onRemove,
  onClear,
}: RecentSearchesSectionProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.column}>
        <View style={styles.headerRow}>
          <View style={styles.labelRow}>
            <History color={Palette.textMuted} size={16} strokeWidth={2.2} />
            <AppText variant="label" weight="700">
              Recent Searches
            </AppText>
          </View>
          {recent.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear recent searches"
              hitSlop={6}
              onPress={onClear}>
              <AppText variant="caption" color={Palette.textMuted} weight="600">
                Clear
              </AppText>
            </Pressable>
          ) : null}
        </View>

        {recent.length > 0 ? (
          <View style={styles.chips}>
            {recent.map((item) => (
              <View key={item.id} style={styles.chip}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Search ${item.label}`}
                  onPress={() => onSelect(item.label)}>
                  <AppText variant="bodySmall" weight="500">
                    {item.label}
                  </AppText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.label}`}
                  hitSlop={6}
                  onPress={() => onRemove(item.id)}>
                  <X color={Palette.textMuted} size={13} strokeWidth={2.2} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <AppText variant="bodySmall" color={Palette.textMuted}>
            No recent searches yet.
          </AppText>
        )}

        <View style={styles.divider} />

        <View style={styles.labelRow}>
          <Flame color={Palette.warning} size={16} strokeWidth={2.2} />
          <AppText variant="label" weight="700">
            Popular in Community
          </AppText>
        </View>

        <View style={styles.chips}>
          {popularSearches.map((topic) => (
            <Pressable
              key={topic.id}
              accessibilityRole="button"
              accessibilityLabel={`Search ${topic.label}`}
              onPress={() => onSelect(topic.label)}
              style={({ pressed }) => [styles.topicChip, pressed && styles.pressed]}>
              <AppText variant="bodySmall" weight="500" numberOfLines={1}>
                {topic.label}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.background,
    borderRadius: Radius.xl,
  },
  column: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  pressed: {
    opacity: 0.8,
  },
});
