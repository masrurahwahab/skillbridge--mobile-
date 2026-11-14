import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { Palette, Spacing } from '@/constants/theme';

import { AppText } from './app-text';
import { Button } from './button';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = Palette.primary,
  actionLabel,
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.titleRow}>
          {Icon ? <Icon color={iconColor} size={18} strokeWidth={2.2} /> : null}
          <AppText variant="subtitle" weight="700">
            {title}
          </AppText>
        </View>
        {subtitle ? (
          <AppText variant="bodySmall" color={Palette.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {actionLabel ? (
        <Button variant="link" size="sm" label={actionLabel} onPress={onActionPress} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  titleGroup: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
