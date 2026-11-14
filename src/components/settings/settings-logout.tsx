import { LogOut } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SettingsItem } from '@/types';

type SettingsLogoutProps = {
  item: SettingsItem;
  versionLabel: string;
  onPress: () => void;
};

export function SettingsLogout({ item, versionLabel, onPress }: SettingsLogoutProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.title}
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <LogOut color={Palette.danger} size={18} strokeWidth={2.2} />
        <AppText variant="label" color={Palette.danger} weight="700">
          {item.title}
        </AppText>
      </Pressable>
      <AppText variant="caption" color={Palette.textMuted} align="center">
        {versionLabel}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  button: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.dangerSoft,
    backgroundColor: Palette.dangerSoft,
  },
  pressed: {
    opacity: 0.75,
  },
});
