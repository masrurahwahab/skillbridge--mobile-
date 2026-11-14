import { Brain, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { SearchInput } from '@/components/ui/search-input';
import { Palette, Radius, Spacing } from '@/constants/theme';

type SearchHeaderProps = {
  query: string;
  mappedIntent?: string;
  onChangeQuery: (value: string) => void;
  onClear: () => void;
};

export function SearchHeader({
  query,
  mappedIntent,
  onChangeQuery,
  onClear,
}: SearchHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <View style={styles.titleGroup}>
            <AppText variant="headline">Search</AppText>
            <AppText variant="bodySmall" color={Palette.textMuted}>
              Find skills, people and learning sessions.
            </AppText>
          </View>
          <View style={styles.aiPill}>
            <Sparkles color={Palette.primary} size={14} strokeWidth={2.2} />
            <AppText variant="caption" color={Palette.primary} weight="700">
              AI assisted
            </AppText>
          </View>
        </View>

        <SearchInput
          value={query}
          onChangeText={onChangeQuery}
          onClear={onClear}
          placeholder="What do you want to learn?"
        />

        {mappedIntent ? (
          <View style={styles.intent}>
            <Brain color={Palette.accent} size={15} strokeWidth={2.2} />
            <AppText
              variant="caption"
              color={Palette.accent}
              weight="500"
              style={styles.intentText}>
              Mapped intent:{' '}
              <AppText variant="caption" color={Palette.accent} weight="700">
                {mappedIntent}
              </AppText>
            </AppText>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  container: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleGroup: {
    flex: 1,
    gap: 1,
  },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Palette.lavender,
  },
  intent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.md,
    backgroundColor: Palette.accentSubtle,
    borderWidth: 1,
    borderColor: Palette.accentBorder,
  },
  intentText: {
    flex: 1,
  },
});
