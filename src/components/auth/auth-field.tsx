import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius, Typography } from '@/constants/theme';

type AuthFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  isPassword?: boolean;
  passwordVisible?: boolean;
  onTogglePassword?: () => void;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
};

export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  isPassword = false,
  passwordVisible = false,
  onTogglePassword,
  keyboardType,
  autoCapitalize = 'none',
  autoComplete,
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <AppText variant="caption" weight="600">
        {label}
      </AppText>
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Palette.textMuted}
          secureTextEntry={isPassword && !passwordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={Palette.accent}
          style={[
            styles.input,
            focused && styles.inputFocused,
            isPassword && styles.passwordInput,
          ]}
        />
        {isPassword ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            onPress={onTogglePassword}
            hitSlop={8}
            style={styles.eyeButton}>
            {passwordVisible ? (
              <EyeOff color={Palette.textMuted} size={18} />
            ) : (
              <Eye color={Palette.textMuted} size={18} />
            )}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 4,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    ...Typography.body,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surface,
    color: Palette.text,
  },
  inputFocused: {
    borderColor: Palette.accent,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
