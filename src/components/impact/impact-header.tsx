import { ArrowLeft, Share2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Spacing } from '@/constants/theme';

type ImpactHeaderProps = {
  onBack: () => void;
  onShare: () => void;
};

export function ImpactHeader({ onBack, onShare }: ImpactHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back to exchange"
            size={36}
            onPress={onBack}
          />
          <View style={styles.titleGroup}>
            <AppText variant="title" weight="700">
              Your Impact
            </AppText>
            <AppText variant="caption" color={Palette.textMuted}>
              Reviews and community momentum
            </AppText>
          </View>
        </View>

        <IconButton
          icon={Share2}
          accessibilityLabel="Share your impact"
          size={36}
          onPress={onShare}
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
