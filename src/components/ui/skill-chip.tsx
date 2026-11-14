import { Check, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { Palette, Radius } from '@/constants/theme';

import { AppText } from './app-text';

type SkillChipTone = 'default' | 'teach' | 'learn' | 'neutral';

type SkillChipProps = {
  label: string;
  icon?: LucideIcon;
  selected?: boolean;
  tone?: SkillChipTone;
  selectedColor?: string;
  showSelectedCheck?: boolean;
  iconColor?: string;
  onPress?: () => void;
};

export function SkillChip({
  label,
  icon: Icon,
  selected = false,
  tone = 'default',
  selectedColor = Palette.primary,
  showSelectedCheck = false,
  iconColor = Palette.accent,
  onPress,
}: SkillChipProps) {
  const textColor = selected
    ? Palette.white
    : tone === 'teach'
      ? Palette.teachText
      : tone === 'learn'
        ? Palette.learnText
        : Palette.text;
  const resolvedIconColor = selected
    ? Palette.white
    : tone === 'teach'
      ? Palette.teachText
      : tone === 'learn'
        ? Palette.learnText
        : iconColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected
          ? [styles.selected, { backgroundColor: selectedColor, borderColor: selectedColor }]
          : tone === 'teach'
            ? styles.teach
            : tone === 'learn'
              ? styles.learn
              : tone === 'neutral'
                ? styles.neutral
                : styles.unselected,
        pressed && styles.pressed,
      ]}>
      {selected && showSelectedCheck ? (
        <Check color={Palette.white} size={14} strokeWidth={2.5} />
      ) : Icon ? (
        <Icon color={resolvedIconColor} size={14} strokeWidth={2.2} />
      ) : null}
      <AppText
        variant="label"
        color={textColor}
        weight={selected ? '600' : '500'}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  selected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  unselected: {
    backgroundColor: Palette.surface,
    borderColor: Palette.border,
  },
  teach: {
    backgroundColor: Palette.teachBg,
    borderColor: Palette.teachBorder,
  },
  learn: {
    backgroundColor: Palette.learnBg,
    borderColor: Palette.learnBorder,
  },
  neutral: {
    backgroundColor: Palette.surfaceMuted,
    borderColor: Palette.border,
  },
  pressed: {
    opacity: 0.8,
  },
});
