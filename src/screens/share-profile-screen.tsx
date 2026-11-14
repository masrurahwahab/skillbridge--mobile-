import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, View } from 'react-native';

import { ShareActions } from '@/components/share/share-actions';
import { ShareLinkBox } from '@/components/share/share-link-box';
import { ShareProfileCard } from '@/components/share/share-profile-card';
import { ShareProfileHeader } from '@/components/share/share-profile-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { skillsService } from '@/services/skills.service';
import type { SkillOption, UserProfile } from '@/types';
import { handleForName, iconForSkill } from '@/utils/skills';

type ShareProfileScreenProps = {
  onClose?: () => void;
};

function emptyProfile(user: NonNullable<ReturnType<typeof useAuth>['user']>): UserProfile {
  return {
    name: user.name,
    handle: handleForName(user.name),
    avatarUrl: user.avatarUrl ?? '',
    badge: 'SkillBridge member',
    role: user.bio ? 'Exchange partner' : 'Learner',
    location: user.location || user.timeZone || 'Remote',
    bio: user.bio || 'Swap skills and grow together on SkillBridge.',
    stats: [
      { id: 'rating', label: 'Rating', value: user.averageRating.toFixed(1), tone: 'success' },
      { id: 'swaps', label: 'Swaps', value: String(user.completedSwaps), tone: 'primary' },
    ],
    teachSkills: [],
    learnSkills: [],
    posts: [],
    postCount: 0,
    exchangeCount: user.completedSwaps,
  };
}

export function ShareProfileScreen({ onClose }: ShareProfileScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const mySkills = await skillsService.mySkills();
        if (!active) return;
        const teachSkills: SkillOption[] = mySkills.offering.map((item) => ({
          id: String(item.skill.id),
          label: item.skill.name,
          icon: iconForSkill(item.skill.name, item.skill.category),
        }));
        const learnSkills: SkillOption[] = mySkills.wanted.map((item) => ({
          id: String(item.skill.id),
          label: item.skill.name,
          icon: iconForSkill(item.skill.name, item.skill.category),
        }));
        setProfile({ ...emptyProfile(user), teachSkills, learnSkills });
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Could not load your profile card.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user]);

  const close = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/profile');
  };

  if (loading) {
    return (
      <View style={styles.state}>
        <ActivityIndicator color={Palette.primary} />
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Preparing your profile card...
        </AppText>
      </View>
    );
  }

  if (!user || !profile) {
    return (
      <View style={styles.state}>
        <Card style={styles.stateCard}>
          <AppText variant="subtitle" weight="700">
            Sign in to share your profile
          </AppText>
          <AppText variant="bodySmall" color={Palette.textMuted} align="center">
            {error ?? 'Create an account to get your personal SkillBridge card.'}
          </AppText>
          <Button
            label={user ? 'Back to profile' : 'Sign in'}
            size="sm"
            onPress={() => (user ? close() : router.push('/welcome'))}
          />
        </Card>
      </View>
    );
  }

  const shareUrl = `skillbridge.app/${profile.handle}`;

  const shareProfile = async () => {
    try {
      await Share.share({
        message: `Connect with ${profile.name} (${profile.handle}) on SkillBridge and propose a skill swap: https://${shareUrl}`,
      });
    } catch {
      Alert.alert('Share profile', `Share this link with your learning network: ${shareUrl}`);
    }
  };

  const copyLink = () => {
    const clipboard = (
      globalThis as {
        navigator?: { clipboard?: { writeText?: (value: string) => Promise<void> } };
      }
    ).navigator?.clipboard;

    if (clipboard?.writeText) {
      void clipboard
        .writeText(`https://${shareUrl}`)
        .then(() => Alert.alert('Link copied', 'Your profile link is ready to paste.'))
        .catch(() => Alert.alert('Profile link', shareUrl));
      return;
    }

    Alert.alert('Profile link', shareUrl);
  };

  const saveCard = () =>
    Alert.alert('Save profile card', 'Screenshot your card to share it anywhere.');

  return (
    <View style={styles.screen}>
      <ShareProfileHeader onClose={close} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.main}>
          <ShareProfileCard profile={profile} />
          <ShareLinkBox url={shareUrl} onCopy={copyLink} />
        </View>

        <ShareActions
          onWhatsApp={shareProfile}
          onAirDrop={shareProfile}
          onSaveCard={saveCard}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    minHeight: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: Spacing.four,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  main: {
    gap: Spacing.two + Spacing.one,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
