import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

type IconButtonProps = {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress?: () => void;
  badge?: boolean;
  size?: number;
  variant?: 'surface' | 'plain';
};

export function IconButton({
  icon: Icon,
  accessibilityLabel,
  onPress,
  badge = false,
  size = 40,
  variant = 'surface',
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'surface' && styles.surface,
        pressed && styles.pressed,
      ]}>
      <Icon color={Palette.text} size={20} strokeWidth={2} />
      {badge ? <View style={styles.badge} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    backgroundColor: Palette.surfaceMuted,
  },
  pressed: {
    opacity: 0.7,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.accent,
    borderWidth: 2,
    borderColor: Palette.surface,
  },
});
