import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Palette, Radius } from '@/constants/theme';
import type { SettingsItem, SettingsSection as SettingsSectionModel } from '@/types';

import { SettingsRow } from './settings-row';

type SettingsSectionProps = {
  section: SettingsSectionModel;
  matchingEnabled: boolean;
  onItemPress: (item: SettingsItem) => void;
  onToggleMatching: () => void;
};

export function SettingsSection({
  section,
  matchingEnabled,
  onItemPress,
  onToggleMatching,
}: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <AppText variant="caption" color={Palette.textMuted} weight="700" style={styles.heading}>
        {section.title.toUpperCase()}
      </AppText>

      <Card padded={false} style={styles.card}>
        {section.items.map((item, index) => (
          <SettingsRow
            key={item.id}
            item={item}
            enabled={item.id === 'matching' ? matchingEnabled : item.enabled}
            showDivider={index > 0}
            onPress={() => onItemPress(item)}
            onToggle={item.id === 'matching' ? onToggleMatching : undefined}
          />
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 7,
  },
  heading: {
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  card: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
  },
});
