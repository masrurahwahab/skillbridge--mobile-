import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { SettingsHeader } from '@/components/settings/settings-header';
import { SettingsLogout } from '@/components/settings/settings-logout';
import { SettingsSection } from '@/components/settings/settings-section';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  logoutSettingsItem,
  settingsSections,
  settingsVersionLabel,
} from '@/constants/content';
import type { SettingsItem } from '@/types';

export function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [matchingEnabled, setMatchingEnabled] = useState(true);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/profile');
  };

  const logOut = () =>
    Alert.alert('Log out of SkillBridge?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/welcome');
        },
      },
    ]);

  const handleItemPress = (item: SettingsItem) => {
    switch (item.action) {
      case 'edit-profile':
        router.push('/profile/edit');
        break;
      case 'manage-skills':
        router.push('/onboarding/skills');
        break;
      case 'share-profile':
        router.push('/share-profile');
        break;
      case 'notifications':
        router.push('/notifications');
        break;
      case 'privacy':
        Alert.alert(
          'Privacy & security',
          'Video permissions and data controls are coming next.',
        );
        break;
      case 'logout':
        logOut();
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.screen}>
      <SettingsHeader onBack={goBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {settingsSections.map((section) => (
          <SettingsSection
            key={section.id}
            section={section}
            matchingEnabled={matchingEnabled}
            onItemPress={handleItemPress}
            onToggleMatching={() => setMatchingEnabled((current) => !current)}
          />
        ))}

        <SettingsLogout
          item={logoutSettingsItem}
          versionLabel={settingsVersionLabel}
          onPress={logOut}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
});
