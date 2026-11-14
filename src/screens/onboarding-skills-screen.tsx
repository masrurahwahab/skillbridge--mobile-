import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MatchPreview } from '@/components/onboarding/match-preview';
import { OnboardingHeader } from '@/components/onboarding/onboarding-header';
import { SkillSelectionSection } from '@/components/onboarding/skill-selection-section';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { onboardingStep } from '@/constants/content';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { skillsService } from '@/services/skills.service';
import { usersService } from '@/services/users.service';
import type { OnboardingSkillOption } from '@/types';
import { iconForSkill } from '@/utils/skills';

export function OnboardingSkillsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [options, setOptions] = useState<OnboardingSkillOption[]>([]);
  const [teachIds, setTeachIds] = useState<string[]>([]);
  const [learnIds, setLearnIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [skills, mySkills] = await Promise.all([
        skillsService.search(undefined, undefined, 1, 100),
        user ? skillsService.mySkills() : Promise.resolve({ offering: [], wanted: [] }),
      ]);
      const catalog: OnboardingSkillOption[] = skills.items.map((skill) => ({
        id: String(skill.id),
        label: skill.name,
        icon: iconForSkill(skill.name, skill.category),
        selected: false,
      }));
      setOptions(catalog);
      setTeachIds(mySkills.offering.map((item) => String(item.skill.id)));
      setLearnIds(mySkills.wanted.map((item) => String(item.skill.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the skill catalog.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/welcome');
  };

  const toggleTeach = (id: string) =>
    setTeachIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  const toggleLearn = (id: string) =>
    setLearnIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const finish = async () => {
    if (!user) {
      router.push('/welcome');
      return;
    }
    if (teachIds.length === 0 || learnIds.length === 0) {
      Alert.alert('Pick both sides', 'Choose at least one skill to teach and one skill to learn.');
      return;
    }
    setSubmitting(true);
    try {
      await usersService.completeOnboarding(
        learnIds.map(Number),
        teachIds.map(Number)
      );
      router.replace('/');
    } catch (err) {
      Alert.alert(
        'Could not save skills',
        err instanceof Error ? err.message : 'Please try again in a moment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <OnboardingHeader
        currentStep={onboardingStep.current}
        totalSteps={onboardingStep.total}
        onBack={goBack}
        onSkip={() => router.replace('/')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <AppText variant="overline" color={Palette.accent}>
            Step {onboardingStep.current} of {onboardingStep.total}
          </AppText>
          <AppText variant="headlineSmall" weight="700">
            Curate your Skill Exchange
          </AppText>
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Select what you can teach and what you want to master. We&apos;ll find complementary
            learning partners instantly.
          </AppText>
        </View>

        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={Palette.primary} />
            <AppText variant="bodySmall" color={Palette.textMuted}>
              Loading the skill catalog...
            </AppText>
          </View>
        ) : error ? (
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Skills unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error}
            </AppText>
            <Button label="Try again" size="sm" onPress={load} />
          </Card>
        ) : !user ? (
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Sign in to choose skills
            </AppText>
            <Button label="Sign in" size="sm" onPress={() => router.push('/welcome')} />
          </Card>
        ) : (
          <>
            <SkillSelectionSection
              stepNumber={1}
              title="What skills can you teach?"
              description="Select at least 1 skill you're comfortable mentoring or trading advice on:"
              options={options}
              selectedIds={teachIds}
              tone="teach"
              onToggle={toggleTeach}
            />

            <SkillSelectionSection
              stepNumber={2}
              title="What skills do you want to learn?"
              description="Select areas you'd like to discover or receive mentorship in:"
              options={options}
              selectedIds={learnIds}
              tone="learn"
              onToggle={toggleLearn}
            />

            <MatchPreview />
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
        <Button
          label={submitting ? 'Saving skills...' : 'Continue to Discovery'}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
          disabled={loading || submitting || !user}
          onPress={finish}
        />
      </View>
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
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  intro: {
    gap: 6,
  },
  state: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  footer: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two + Spacing.one,
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
});
