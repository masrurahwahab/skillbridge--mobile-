import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';

type OnboardingHeaderProps = {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onSkip: () => void;
};

export function OnboardingHeader({
  currentStep,
  totalSteps,
  onBack,
  onSkip,
}: OnboardingHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back to welcome"
          size={36}
          onPress={onBack}
        />

        <View style={styles.steps}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[styles.step, index < currentStep && styles.stepActive]}
            />
          ))}
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Skip onboarding" onPress={onSkip} hitSlop={8}>
          <AppText variant="caption" color={Palette.textMuted} weight="600">
            Skip
          </AppText>
        </Pressable>
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
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  step: {
    width: 24,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.border,
  },
  stepActive: {
    backgroundColor: Palette.primary,
  },
});
