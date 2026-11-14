import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AuthCard, type AuthPayload } from '@/components/auth/auth-card';
import { WelcomeHeader } from '@/components/auth/welcome-header';
import { WelcomeHero } from '@/components/auth/welcome-hero';
import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export function WelcomeScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const handleSubmit = async (payload: AuthPayload) => {
    setLoading(true);
    try {
      if (payload.mode === 'register') {
        await register(payload.fullName, payload.email, payload.password);
        router.push('/onboarding/skills');
      } else {
        await login(payload.email, payload.password);
        router.replace('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      Alert.alert(
        payload.mode === 'register' ? 'Sign Up Failed' : 'Log In Failed',
        msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <WelcomeHeader onBack={goBack} />

      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag">
          <WelcomeHero />
          <AuthCard onSubmit={handleSubmit} isLoading={loading} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Explore community without signing in"
            onPress={() => router.replace('/')}
            hitSlop={8}
            style={styles.explore}>
            <AppText variant="bodySmall" color={Palette.accent} weight="600" align="center">
              Explore community without signing in →
            </AppText>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 460,
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  explore: {
    paddingVertical: Spacing.two,
  },
});
