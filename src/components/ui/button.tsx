import type { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Palette, Radius } from '@/constants/theme';

import { AppText } from './app-text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const HEIGHTS: Record<ButtonSize, number> = { sm: 36, md: 44 };
const ICON_SIZES: Record<ButtonSize, number> = { sm: 16, md: 18 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const isLink = variant === 'link';
  const textColor =
    variant === 'primary' ? Palette.white : variant === 'secondary' ? Palette.primary : Palette.accent;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        !isLink && {
          height: HEIGHTS[size],
          borderRadius: Radius.full,
          paddingHorizontal: size === 'sm' ? 14 : 18,
        },
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isLink && styles.link,
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      {Icon && iconPosition === 'left' ? (
        <Icon color={textColor} size={ICON_SIZES[size]} strokeWidth={2.2} />
      ) : null}
      <AppText
        variant={size === 'sm' ? 'label' : 'subtitle'}
        color={textColor}
        weight="600"
        numberOfLines={1}>
        {label}
      </AppText>
      {Icon && iconPosition === 'right' ? (
        <Icon color={textColor} size={ICON_SIZES[size]} strokeWidth={2.2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primary: {
    backgroundColor: Palette.primary,
  },
  secondary: {
    backgroundColor: Palette.lavender,
  },
  ghost: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  link: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});
