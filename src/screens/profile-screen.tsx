import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileHero } from '@/components/profile/profile-hero';
import { ProfileSkillsSection } from '@/components/profile/profile-skills-section';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { usersService } from '@/services/users.service';
import type { SkillOption, UserProfile } from '@/types';
import { buildUserProfile } from '@/utils/profile';

export function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const [publicProfile, posts, reviews] = await Promise.all([
        usersService.getProfile(user.id),
        usersService.getPosts(user.id, 20),
        usersService.getReviews(user.id, 1, 20),
      ]);
      setProfile(buildUserProfile(publicProfile, posts, reviews));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your profile.');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const goHome = () => router.push('/');
  const shareProfile = () => router.push('/share-profile');
  const openSettings = () => router.push('/settings');
  const editProfile = () => router.push('/profile/edit');
  const showQr = () => router.push('/share-profile');
  const openSkill = (skill: SkillOption) =>
    router.push({ pathname: '/skill/[id]', params: { id: skill.id } });

  return (
    <View style={styles.screen}>
      <ProfileHeader
        name={profile?.name ?? user?.name ?? 'Profile'}
        onBack={goHome}
        onShare={shareProfile}
        onSettings={openSettings}
      />

      {isLoading || loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Loading your profile...
          </AppText>
        </View>
      ) : !user ? (
        <View style={styles.state}>
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Sign in to your profile
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              Track your skills, reviews, and exchanges in one place.
            </AppText>
            <Button label="Sign in" size="sm" onPress={() => router.push('/welcome')} />
          </Card>
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
            <Button label="Try again" size="sm" onPress={loadProfile} />
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
          <ProfileHero profile={profile} onEdit={editProfile} onQr={showQr} />

          <ProfileSkillsSection
            title="Skills I Can Teach"
            countLabel={`${profile.teachSkills.length} skills`}
            skills={profile.teachSkills}
            tone="teach"
            onSkillPress={openSkill}
          />

          <ProfileSkillsSection
            title="Skills I Want to Learn"
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
