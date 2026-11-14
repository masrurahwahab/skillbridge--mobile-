import { ArrowLeft, Repeat2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';

type WelcomeHeaderProps = {
  onBack: () => void;
};

export function WelcomeHeader({ onBack }: WelcomeHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back to Home"
          size={36}
          onPress={onBack}
        />

        <View style={styles.brand}>
          <View style={styles.logo}>
            <Repeat2 color={Palette.white} size={16} strokeWidth={2.5} />
          </View>
          <AppText variant="subtitle" weight="700" color={Palette.primary}>
            SkillBridge
          </AppText>
        </View>

        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
  },
  spacer: {
    width: 36,
  },
});
