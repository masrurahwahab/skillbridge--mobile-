import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/users.service';

type Field = {
  key: 'name' | 'bio' | 'location' | 'timeZone' | 'avatarUrl';
  label: string;
  placeholder: string;
  multiline?: boolean;
};

const FIELDS: Field[] = [
  { key: 'name', label: 'Display name', placeholder: 'Your name' },
  {
    key: 'bio',
    label: 'Bio',
    placeholder: 'What do you love teaching and learning?',
    multiline: true,
  },
  { key: 'location', label: 'Location', placeholder: 'City, country' },
  { key: 'timeZone', label: 'Time zone', placeholder: 'e.g. WAT, GMT+1' },
  { key: 'avatarUrl', label: 'Avatar image URL', placeholder: 'https://...' },
];

export function ProfileEditScreen() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [values, setValues] = useState({
    name: user?.name ?? '',
    bio: user?.bio ?? '',
    location: user?.location ?? '',
    timeZone: user?.timeZone ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });
  const [saving, setSaving] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/profile');
  };

  const save = async () => {
    if (!values.name.trim()) {
      Alert.alert('Name required', 'Add a display name before saving.');
      return;
    }
    setSaving(true);
    try {
      await usersService.updateProfile(
        values.name.trim(),
        values.bio.trim() || undefined,
        values.location.trim() || undefined,
        values.timeZone.trim() || undefined,
        values.avatarUrl.trim() || undefined
      );
      await refreshUser();
      goBack();
    } catch (err) {
      Alert.alert(
        'Could not save profile',
        err instanceof Error ? err.message : 'Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerInner}>
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back to profile"
            size={36}
            onPress={goBack}
          />
          <AppText variant="subtitle" weight="700">
            Edit Profile
          </AppText>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          {FIELDS.map((field) => (
            <View key={field.key} style={styles.field}>
              <AppText variant="label" weight="700">
                {field.label}
              </AppText>
              <TextInput
                value={values[field.key]}
                onChangeText={(value) =>
                  setValues((current) => ({ ...current, [field.key]: value }))
                }
                placeholder={field.placeholder}
                placeholderTextColor={Palette.textMuted}
                multiline={field.multiline}
                autoCapitalize={field.key === 'name' ? 'words' : 'none'}
                keyboardType={field.key === 'avatarUrl' ? 'url' : 'default'}
                style={[styles.input, field.multiline && styles.multiline]}
              />
            </View>
          ))}

          <Button
            label={saving ? 'Saving...' : 'Save changes'}
            fullWidth
            disabled={saving}
            onPress={save}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    padding: Spacing.three,
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  field: {
    gap: 6,
  },
  input: {
    ...Typography.body,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    color: Palette.text,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
});
