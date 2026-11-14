import { Download, Send, Share2, type LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius } from '@/constants/theme';

type ShareActionsProps = {
  onWhatsApp: () => void;
  onAirDrop: () => void;
  onSaveCard: () => void;
};

export function ShareActions({ onWhatsApp, onAirDrop, onSaveCard }: ShareActionsProps) {
  return (
    <View style={styles.container}>
      <ShareAction
        icon={Send}
        label="WhatsApp"
        color={Palette.accent}
        onPress={onWhatsApp}
      />
      <ShareAction
        icon={Share2}
        label="AirDrop"
        color={Palette.primary}
        onPress={onAirDrop}
      />
      <ShareAction
        icon={Download}
        label="Save Card"
        color={Palette.success}
        onPress={onSaveCard}
      />
    </View>
  );
}

type ShareActionProps = {
  icon: LucideIcon;
  label: string;
  color: string;
  onPress: () => void;
};

function ShareAction({ icon: Icon, label, color, onPress }: ShareActionProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Share via ${label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Icon color={color} size={19} strokeWidth={2.2} />
      <AppText variant="caption" weight="600">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  pressed: {
    opacity: 0.75,
  },
});
