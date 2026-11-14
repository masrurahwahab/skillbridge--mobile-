import { Copy } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius, Spacing } from '@/constants/theme';

type ShareLinkBoxProps = {
  url: string;
  onCopy: () => void;
};

export function ShareLinkBox({ url, onCopy }: ShareLinkBoxProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodySmall" color={Palette.textMuted} numberOfLines={1} style={styles.url}>
        {url}
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Copy profile link"
        onPress={onCopy}
        style={({ pressed }) => [styles.copyButton, pressed && styles.pressed]}>
        <Copy color={Palette.white} size={13} strokeWidth={2.4} />
        <AppText variant="caption" color={Palette.white} weight="700">
          Copy
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: 9,
    paddingLeft: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceMuted,
  },
  url: {
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Palette.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
