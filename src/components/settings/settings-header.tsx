import { ArrowLeft } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Spacing } from '@/constants/theme';

type SettingsHeaderProps = {
  onBack: () => void;
};

export function SettingsHeader({ onBack }: SettingsHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back to profile"
          size={36}
          onPress={onBack}
        />
        <AppText variant="title" weight="700">
          Settings
        </AppText>
        <View style={styles.spacer} />
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
  spacer: {
    width: 36,
  },
});
