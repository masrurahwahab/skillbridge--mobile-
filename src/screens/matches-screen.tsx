import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { MatchCard } from '@/components/matches/match-card';
import { MatchSummaryBar } from '@/components/matches/match-summary-bar';
import { MatchesHeader } from '@/components/matches/matches-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { matchesService } from '@/services/matches.service';
import type { SkillMatch } from '@/types';
import type { MatchDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';

function toSkillMatch(dto: MatchDto): SkillMatch {
  const teaches = dto.theyCanTeachMe.map((skill) => skill.name).join(' & ') || 'Open to share';
  const wants = dto.iCanTeachThem.map((skill) => skill.name).join(' & ') || 'Open to learn';
  const score = Math.round(dto.score);
  return {
    id: dto.user.id,
    name: dto.user.name,
    avatarUrl: dto.user.avatarUrl ?? '',
    verified: dto.user.reviewCount > 0,
    role: dto.user.bio || 'Exchange partner',
    location: dto.user.location || dto.user.timeZone || 'Remote',
    matchPercent: score,
    matchLabel: `${score}% ${dto.kind} match`,
    topPick: score >= 85,
    activity:
      dto.user.completedSwaps > 0
        ? `${dto.user.completedSwaps} swaps completed`
        : 'New to SkillBridge',
    rating: dto.user.averageRating,
    exchangeCount: dto.user.completedSwaps,
    completionRate: undefined,
    teaches,
    wants,
    teachesIcon: iconForSkill(dto.theyCanTeachMe[0]?.name ?? '', dto.theyCanTeachMe[0]?.category),
    wantsIcon: iconForSkill(dto.iCanTeachThem[0]?.name ?? '', dto.iCanTeachThem[0]?.category),
    insight:
      dto.kind === 'Chain'
        ? `A chain swap can connect you with ${dto.user.name.split(' ')[0]} through shared skills.`
        : `${dto.user.name.split(' ')[0]} can teach you ${teaches} and wants to learn ${wants}.`,
    insightTone: score >= 70 ? 'warm' : 'neutral',
  };
}

export function MatchesScreen() {
  const router = useRouter();
  const [matchList, setMatchList] = useState<SkillMatch[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = useCallback(async () => {
    setError(null);
    try {
      let response = await matchesService.getMatches('mutual');
      if (response.items.length === 0) {
        response = await matchesService.getMatches('partial');
      }
      setMatchList(response.items.map(toSkillMatch));
      setTotalCount(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your matches.');
      setMatchList([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadMatches();
    }, [loadMatches])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const goHome = () => router.push('/');
  const showFilters = () =>
    Alert.alert(
      'Match filters',
      'Matches are ranked by reciprocal skill overlap, rating, and activity.'
    );
  const connectWithMatch = (match: SkillMatch) =>
    router.push({ pathname: '/swap/[id]', params: { id: match.id } });
  const viewProfile = (match: SkillMatch) =>
    router.push({ pathname: '/user/[id]', params: { id: match.id } });

  return (
    <View style={styles.screen}>
      <MatchesHeader onBack={goHome} onFilter={showFilters} />
      <MatchSummaryBar total={totalCount} sortLabel="Best skill overlap first" />

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
        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={Palette.primary} />
            <AppText variant="bodySmall" color={Palette.textMuted}>
              Finding reciprocal skill matches...
            </AppText>
          </View>
        ) : null}

        {!loading && error ? (
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Matches unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error}
            </AppText>
            <Button label="Try again" size="sm" onPress={loadMatches} />
          </Card>
        ) : null}

        {!loading && !error && matchList.length === 0 ? (
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              No reciprocal matches yet
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              Add more skills you can teach and want to learn, then check back.
            </AppText>
            <Button
              label="Update skills"
              size="sm"
              onPress={() => router.push('/onboarding/skills')}
            />
          </Card>
        ) : null}

        {!loading && !error
          ? matchList.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onConnect={connectWithMatch}
                onViewProfile={viewProfile}
              />
            ))
          : null}
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
    gap: Spacing.three,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
