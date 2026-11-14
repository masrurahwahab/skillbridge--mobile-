import { useRouter } from 'expo-router';
import { Bell, Repeat2, Search } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export function HomeHeader() {
  const router = useRouter();
  const { user } = useAuth();
  const displayName = user?.name || 'Guest';
  const displayAvatar = user?.avatarUrl || '';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Repeat2 color={Palette.white} size={20} strokeWidth={2.4} />
          </View>
          <View>
            <AppText
              variant="subtitle"
              weight="700"
              color={Palette.primary}
              style={styles.wordmark}>
              SkillBridge
            </AppText>
            <AppText variant="overline" color={Palette.textMuted} style={styles.tagline}>
              EXCHANGE & GROW
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          {!user ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              style={styles.signInPill}
              onPress={() => router.push('/welcome')}>
              <AppText variant="caption" color={Palette.white} weight="700">
                Sign In
              </AppText>
            </Pressable>
          ) : null}
          <IconButton
            icon={Search}
            accessibilityLabel="Search SkillBridge"
            size={36}
            onPress={() => router.push('/search')}
          />
          <IconButton
            icon={Bell}
            accessibilityLabel="Notifications"
            badge
            size={36}
            onPress={() => router.push('/notifications')}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open your profile"
            hitSlop={8}
            onPress={() => (user ? router.push('/profile') : router.push('/welcome'))}>
            <Avatar
              name={displayName}
              uri={displayAvatar}
              size={36}
              ringColor="rgba(55, 48, 163, 0.18)"
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
  },
  wordmark: {
    lineHeight: 19,
  },
  tagline: {
    marginTop: 1,
    letterSpacing: 0.8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  signInPill: {
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: 6,
    borderRadius: Radius.full,
    marginRight: 2,
  },
});
