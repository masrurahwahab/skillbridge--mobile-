import { ArrowLeft, Settings, Share2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Spacing } from '@/constants/theme';

type ProfileHeaderProps = {
  name: string;
  onBack: () => void;
  onShare: () => void;
  onSettings: () => void;
};

export function ProfileHeader({ name, onBack, onShare, onSettings }: ProfileHeaderProps) {
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
          <AppText variant="subtitle" weight="700" numberOfLines={1} style={styles.name}>
            {name}
          </AppText>
        </View>

        <View style={styles.actions}>
          <IconButton icon={Share2} accessibilityLabel="Share profile" size={36} onPress={onShare} />
          <IconButton icon={Settings} accessibilityLabel="Profile settings" size={36} onPress={onSettings} />
        </View>
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
  name: {
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
