import { Paperclip, Send } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Palette, Radius, Typography } from '@/constants/theme';

type SwapComposerProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onAttach: () => void;
};

export function SwapComposer({ value, onChangeText, onSend, onAttach }: SwapComposerProps) {
  const [focused, setFocused] = useState(false);
  const canSend = value.trim().length > 0;

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Attach a file"
        hitSlop={6}
        onPress={onAttach}
        style={styles.attachButton}>
        <Paperclip color={Palette.textMuted} size={19} strokeWidth={2.2} />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Write a message..."
        placeholderTextColor={Palette.textMuted}
        selectionColor={Palette.accent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onSubmitEditing={() => {
          if (canSend) {
            onSend();
          }
        }}
        returnKeyType="send"
        style={styles.input}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Send message"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={onSend}
        style={({ pressed }) => [
          styles.sendButton,
          !canSend && styles.sendDisabled,
          pressed && canSend && styles.pressed,
        ]}>
        <Send color={Palette.white} size={17} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    paddingLeft: 6,
    paddingRight: 5,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.background,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  focused: {
    backgroundColor: Palette.surface,
    borderColor: Palette.accent,
  },
  attachButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Palette.text,
    paddingVertical: 7,
    paddingHorizontal: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
  },
  sendDisabled: {
    backgroundColor: Palette.borderStrong,
  },
  pressed: {
    opacity: 0.8,
  },
});
