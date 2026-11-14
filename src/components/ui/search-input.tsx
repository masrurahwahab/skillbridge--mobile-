import { Search, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/theme';

type SearchInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  onSubmitEditing?: () => void;
  autoFocus?: boolean;
};

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search skills, people or sessions',
  onSubmitEditing,
  autoFocus,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.container, focused && styles.focused]}>
      <Search color={focused ? Palette.accent : Palette.textMuted} size={18} strokeWidth={2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Palette.textMuted}
        onSubmitEditing={onSubmitEditing}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        autoFocus={autoFocus}
        style={styles.input}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={handleClear}>
          <X color={Palette.textMuted} size={16} strokeWidth={2.2} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 50,
    paddingHorizontal: 14,
    backgroundColor: Palette.background,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  focused: {
    backgroundColor: Palette.surface,
    borderColor: Palette.accent,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Palette.text,
    paddingVertical: 0,
  },
});
