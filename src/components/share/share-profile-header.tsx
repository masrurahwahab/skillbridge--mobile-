import { X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Spacing } from '@/constants/theme';

type ShareProfileHeaderProps = {
  onClose: () => void;
};

export function ShareProfileHeader({ onClose }: ShareProfileHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={X}
          accessibilityLabel="Close share profile"
          size={36}
          onPress={onClose}
        />
        <AppText variant="title" weight="700">
          Share Profile
        </AppText>
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
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + Spacing.one,
  },
  spacer: {
    width: 36,
  },
});
