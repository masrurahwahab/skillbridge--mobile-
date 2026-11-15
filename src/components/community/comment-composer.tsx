import { Send } from 'lucide-react-native';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Palette, Radius, Spacing, Typography } from '@/constants/theme';

type CommentComposerProps = {
  value: string;
  sending?: boolean;
  onChangeText: (value: string) => void;
  onSend: () => void;
};

export function CommentComposer({
  value,
  sending = false,
  onChangeText,
  onSend,
}: CommentComposerProps) {
  const canSend = value.trim().length > 0 && !sending;

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write a reply..."
        placeholderTextColor={Palette.textMuted}
        selectionColor={Palette.accent}
        multiline
        maxLength={2000}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Post reply"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={onSend}
        style={({ pressed }) => [
          styles.send,
          !canSend && styles.sendDisabled,
          pressed && canSend && styles.pressed,
        ]}>
        <Send color={Palette.white} size={18} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    backgroundColor: Palette.surface,
  },
  input: {
    ...(Typography.body as object),
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    paddingHorizontal: Spacing.three,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    color: Palette.text,
  },
  send: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
  },
  sendDisabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
