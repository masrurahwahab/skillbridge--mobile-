import { ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';

import { AuthField } from './auth-field';

export type AuthMode = 'register' | 'login';

export type AuthPayload = {
  mode: AuthMode;
  fullName: string;
  email: string;
  password: string;
};

type AuthCardProps = {
  onSubmit: (payload: AuthPayload) => void;
  isLoading?: boolean;
};

export function AuthCard({ onSubmit, isLoading }: AuthCardProps) {
  const [mode, setMode] = useState<AuthMode>('register');
  const [fullName, setFullName] = useState('Maya Chen');
  const [email, setEmail] = useState('ada@skillswap.demo');
  const [password, setPassword] = useState('Password123!');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = () => {
    onSubmit({ mode, fullName, email, password });
  };

  return (
    <Card style={styles.card}>
      <View style={styles.segmented}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: isRegister }}
          onPress={() => setMode('register')}
          style={[styles.segment, isRegister && styles.segmentActive]}>
          <AppText
            variant="label"
            color={isRegister ? Palette.primary : Palette.textMuted}
            weight={isRegister ? '700' : '500'}>
            Create Account
          </AppText>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'login' }}
          onPress={() => setMode('login')}
          style={[styles.segment, mode === 'login' && styles.segmentActive]}>
          <AppText
            variant="label"
            color={mode === 'login' ? Palette.primary : Palette.textMuted}
            weight={mode === 'login' ? '700' : '500'}>
            Log In
          </AppText>
        </Pressable>
      </View>

      <View style={styles.form}>
        {isRegister ? (
          <AuthField
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Maya Chen"
            autoCapitalize="words"
            autoComplete="name"
          />
        ) : null}

        <AuthField
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          placeholder="ada@skillswap.demo"
          keyboardType="email-address"
          autoComplete="email"
        />

        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••••••"
          isPassword
          passwordVisible={passwordVisible}
          onTogglePassword={() => setPasswordVisible((current) => !current)}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />

        <Button
          label={
            isLoading
              ? 'Connecting...'
              : isRegister
              ? 'Continue to Skill Setup'
              : 'Log In & Explore'
          }
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          disabled={isLoading}
          onPress={handleSubmit}
          style={styles.submit}
        />
      </View>

      <AppText variant="caption" color={Palette.textMuted} align="center" style={styles.terms}>
        By signing up, you agree to the{' '}
        <AppText
          variant="caption"
          color={Palette.accent}
          weight="600"
          style={styles.inlineLink}
          onPress={() => Alert.alert('Terms of Exchange', 'Terms are coming soon.')}>
          Terms of Exchange
        </AppText>{' '}
        &amp;{' '}
        <AppText
          variant="caption"
          color={Palette.accent}
          weight="600"
          style={styles.inlineLink}
          onPress={() => Alert.alert('Community Code', 'Community guidelines are coming soon.')}>
          Community Code
        </AppText>
        .
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  segmented: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    borderRadius: Radius.md,
    backgroundColor: Palette.background,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
  },
  segmentActive: {
    backgroundColor: Palette.surface,
  },
  form: {
    gap: 10,
  },
  submit: {
    marginTop: 2,
  },
  terms: {
    lineHeight: 16,
  },
  inlineLink: {
    textDecorationLine: 'underline',
  },
});
