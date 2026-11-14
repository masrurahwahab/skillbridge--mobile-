import {
  Bell,
  ChevronRight,
  Layers,
  Lock,
  LogOut,
  Share2,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius } from '@/constants/theme';
import type { SettingsIcon, SettingsItem } from '@/types';

type SettingsRowProps = {
  item: SettingsItem;
  enabled?: boolean;
  showDivider?: boolean;
  onPress?: () => void;
  onToggle?: () => void;
};

type ToneStyle = {
  background: string;
  color: string;
};

const SETTINGS_ICONS: Record<SettingsIcon, LucideIcon> = {
  profile: User,
  skills: Layers,
  share: Share2,
  matching: Sparkles,
  notifications: Bell,
  privacy: Lock,
  logout: LogOut,
};

const TONE_STYLES: Record<NonNullable<SettingsItem['tone']>, ToneStyle> = {
  accent: { background: Palette.accentSubtle, color: Palette.accent },
  success: { background: Palette.successSoft, color: Palette.success },
  warning: { background: Palette.warningSoft, color: Palette.warning },
  learn: { background: Palette.learnBg, color: Palette.learnText },
  neutral: { background: Palette.surfaceMuted, color: Palette.textMuted },
  danger: { background: Palette.dangerSoft, color: Palette.danger },
};

export function SettingsRow({
  item,
  enabled = false,
  showDivider = false,
  onPress,
  onToggle,
}: SettingsRowProps) {
  const Icon = SETTINGS_ICONS[item.icon];
  const tone = TONE_STYLES[item.tone ?? 'neutral'];

  const content = (
    <>
      <View style={[styles.iconTile, { backgroundColor: tone.background }]}>
        <Icon color={tone.color} size={19} strokeWidth={2.2} />
      </View>

      <View style={styles.copy}>
        <AppText
          variant="body"
          weight="700"
          color={item.tone === 'danger' ? Palette.danger : Palette.text}
          numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="caption" color={Palette.textMuted} numberOfLines={2}>
          {item.description}
        </AppText>
      </View>
    </>
  );

  if (item.kind === 'toggle') {
    return (
      <View style={[styles.row, showDivider && styles.divider]}>
        {content}
        <Switch
          value={enabled}
          onValueChange={onToggle}
          accessibilityLabel={item.title}
          trackColor={{ false: Palette.borderStrong, true: Palette.primary }}
          thumbColor={Palette.white}
          ios_backgroundColor={Palette.borderStrong}
        />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showDivider && styles.divider,
        pressed && styles.pressed,
      ]}>
      {content}
      <ChevronRight color={Palette.textMuted} size={18} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: Palette.surface,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 1,
  },
  pressed: {
    opacity: 0.75,
  },
});
