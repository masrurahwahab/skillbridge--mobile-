import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';

import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileHero } from '@/components/profile/profile-hero';
import { ProfileSkillsSection } from '@/components/profile/profile-skills-section';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { usersService } from '@/services/users.service';
import type { SkillOption, UserProfile } from '@/types';
import { buildUserProfile } from '@/utils/profile';

type UserProfileScreenProps = {
  userId?: string;
};

export function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!userId) {
      setError('This member could not be found.');
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const [publicProfile, posts, reviews] = await Promise.all([
        usersService.getProfile(userId),
        usersService.getPosts(userId, 20),
        usersService.getReviews(userId, 1, 20),
      ]);
      setProfile(buildUserProfile(publicProfile, posts, reviews));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/matches');
  };

  const shareProfile = async () => {
    if (!profile) return;
    try {
      await Share.share({
        message: `Connect with ${profile.name} on SkillBridge and propose a skill swap.`,
      });
    } catch {
      Alert.alert('Share profile', `Invite someone to connect with ${profile.name}.`);
    }
  };

  const proposeSwap = () => {
    if (!userId) return;
    router.push({ pathname: '/swap/[id]', params: { id: userId } });
  };

  const openSkill = (skill: SkillOption) =>
    router.push({ pathname: '/skill/[id]', params: { id: skill.id } });

  return (
    <View style={styles.screen}>
      <ProfileHeader
        name={profile?.name ?? 'Profile'}
        onBack={goBack}
        onShare={shareProfile}
        onSettings={shareProfile}
      />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Loading profile...
          </AppText>
        </View>
      ) : error || !profile ? (
        <View style={styles.state}>
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Profile unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error ?? 'Please try again.'}
            </AppText>
            <Button label="Try again" size="sm" onPress={load} />
          </Card>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Palette.primary]}
              tintColor={Palette.primary}
            />
          }>
          <ProfileHero
            profile={profile}
            onEdit={proposeSwap}
            onQr={shareProfile}
            primaryLabel="Propose swap"
          />

          <View style={styles.actions}>
            <Button label="Propose a swap" fullWidth onPress={proposeSwap} />
          </View>

          <ProfileSkillsSection
            title="Skills They Can Teach"
            countLabel={`${profile.teachSkills.length} skills`}
            skills={profile.teachSkills}
            tone="teach"
            onSkillPress={openSkill}
          />

          <ProfileSkillsSection
            title="Skills They Want to Learn"
            countLabel={`${profile.learnSkills.length} active`}
            skills={profile.learnSkills}
            tone="learn"
            onSkillPress={openSkill}
          />

          <ProfileTabs profile={profile} onViewPost={() => router.push('/community')} />
        </ScrollView>
      )}
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
  actions: {
    gap: Spacing.two,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    width: '100%',
  },
});
