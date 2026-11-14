import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Spacing } from '@/constants/theme';

type MatchesHeaderProps = {
  onBack: () => void;
  onFilter: () => void;
};

export function MatchesHeader({ onBack, onFilter }: MatchesHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back to Home"
            size={36}
            onPress={onBack}
          />
          <View style={styles.titleGroup}>
            <AppText variant="title" weight="700" numberOfLines={1}>
              Skill Matches
            </AppText>
            <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
              Reciprocal 1-on-1 Exchanges
            </AppText>
          </View>
        </View>

        <IconButton
          icon={SlidersHorizontal}
          accessibilityLabel="Filter matches"
          size={36}
          onPress={onFilter}
        />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + Spacing.one,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
  },
  titleGroup: {
    flex: 1,
    gap: 1,
  },
});
