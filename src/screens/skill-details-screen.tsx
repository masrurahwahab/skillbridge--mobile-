import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, View } from 'react-native';

import { SkillActionBar } from '@/components/skill/skill-action-bar';
import { SkillDetailsHeader } from '@/components/skill/skill-details-header';
import { SkillDiscussionCard } from '@/components/skill/skill-discussion-card';
import { SkillOverviewCard } from '@/components/skill/skill-overview-card';
import { SkillPeopleSection } from '@/components/skill/skill-people-section';
import { SkillRelatedSection } from '@/components/skill/skill-related-section';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { skillsService } from '@/services/skills.service';
import type { RelatedSkill, SkillDetail, SkillLearner, SkillTeacher } from '@/types';
import type { SkillDetailDto, UserDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';
import { formatRelativeTime } from '@/utils/time';

type SkillDetailsScreenProps = {
  skillId?: string;
};

function toTeacher(user: UserDto): SkillTeacher {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? '',
    role: user.bio || user.location || 'Skill teacher',
    rating: user.averageRating,
    sessions: user.completedSwaps,
  };
}

function toLearner(user: UserDto, skillName: string): SkillLearner {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? '',
    role: user.bio || 'Learner',
    goal: `Wants to learn ${skillName}`,
    availability: user.timeZone || user.location || 'Flexible',
  };
}

function toSkillDetail(dto: SkillDetailDto): SkillDetail {
  const { skill, discussion } = dto;
  const icon = iconForSkill(skill.name, skill.category);

  return {
    id: String(skill.id),
    title: skill.name,
    category: skill.category,
    icon,
    demandLabel: `${dto.wantedCount} learners want this`,
    description: `Connect with ${dto.teachersCount} people teaching ${skill.name} and ${
      dto.learnersCount
    } learners ready to swap skills.`,
    teachesCount: dto.teachersCount,
    learnersCount: dto.learnersCount,
    highlights: [
      `${dto.teachersCount} teachers`,
      `${dto.learnersCount} learners`,
      `${dto.relatedSkills.length} related skills`,
    ],
    relatedSkills: dto.relatedSkills.map<RelatedSkill>((related) => ({
      id: String(related.id),
      label: related.name,
      icon: iconForSkill(related.name, related.category),
      detailId: String(related.id),
    })),
    teachers: dto.teachers.map(toTeacher),
    learners: dto.learners.map((learner) => toLearner(learner, skill.name)),
    discussion: discussion
      ? {
          id: discussion.id,
          author: {
            name: discussion.author.name,
            handle: `@${discussion.author.name.toLowerCase().replace(/\s+/g, '')}`,
            role: 'Member',
            avatarUrl: discussion.author.avatarUrl ?? '',
          },
          category: discussion.category,
          timeAgo: formatRelativeTime(discussion.createdAt),
          question: discussion.content,
          answers: discussion.commentsCount,
          peerSessions: discussion.commentsCount,
        }
      : undefined,
  };
}

export function SkillDetailsScreen({ skillId }: SkillDetailsScreenProps) {
  const router = useRouter();
  const [skill, setSkill] = useState<SkillDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    if (!skillId || Number.isNaN(Number(skillId))) {
      setError('This skill could not be found.');
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const dto = await skillsService.get(Number(skillId));
      setSkill(toSkillDetail(dto));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this skill.');
      setSkill(null);
    } finally {
      setLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/search');
  };

  const openRelatedSkill = (related: RelatedSkill) => {
    if (related.detailId) {
      router.push({ pathname: '/skill/[id]', params: { id: related.detailId } });
    }
  };

  const shareSkill = async () => {
    if (!skill) return;
    try {
      await Share.share({
        message: `Explore ${skill.title} on SkillBridge — discover people who teach and want to learn it.`,
      });
    } catch {
      Alert.alert('Share skill', `Share ${skill.title} with your learning circle.`);
    }
  };

  return (
    <View style={styles.screen}>
      <SkillDetailsHeader
        onBack={goBack}
        onShare={shareSkill}
        onSave={() => setSaved((current) => !current)}
        saved={saved}
      />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Loading skill details...
          </AppText>
        </View>
      ) : error || !skill ? (
        <View style={styles.state}>
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Skill unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error ?? 'Please try another skill.'}
            </AppText>
            <Button label="Try again" size="sm" onPress={load} />
          </Card>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}>
            <SkillOverviewCard skill={skill} />
            <SkillRelatedSection skills={skill.relatedSkills} onSelect={openRelatedSkill} />
            <SkillPeopleSection
              teachers={skill.teachers}
              learners={skill.learners}
              teacherCount={skill.teachesCount}
              learnerCount={skill.learnersCount}
              onConnect={() => router.push('/matches')}
            />
            <SkillDiscussionCard
              discussion={skill.discussion}
              onPress={() => router.push('/community')}
            />
          </ScrollView>

          <SkillActionBar
            teacherCount={skill.teachesCount}
            onFindPartner={() => router.push('/matches')}
          />
        </>
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
    paddingBottom: Spacing.four,
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
    width: '100%',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
