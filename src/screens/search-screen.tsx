import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { DiscussionSection } from '@/components/search/discussion-section';
import { MentorsSection } from '@/components/search/mentors-section';
import { RecentSearchesSection } from '@/components/search/recent-searches-section';
import { RelatedSkillsSection } from '@/components/search/related-skills-section';
import { SearchHeader } from '@/components/search/search-header';
import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { searchService } from '@/services/search.service';
import type { Person, RecentSearch } from '@/types';
import type { MatchDto, SearchResultDto, SkillDto } from '@/types/api';
import { handleForName, iconForSkill } from '@/utils/skills';

function toPerson(match: MatchDto): Person {
  const teaches = match.theyCanTeachMe[0];
  const wants = match.iCanTeachThem[0];
  const icon = iconForSkill(teaches?.name ?? '', teaches?.category);
  return {
    id: match.user.id,
    name: match.user.name,
    handle: handleForName(match.user.name),
    avatarUrl: match.user.avatarUrl ?? '',
    matchPercent: Math.round(match.score),
    teaches: teaches?.name ?? 'Skill exchange',
    wants: wants?.name ?? 'Open to learning',
    teachesIcon: icon,
    wantsIcon: iconForSkill(wants?.name ?? '', wants?.category),
    badge: match.kind,
    badgeTone: match.kind === 'Mutual' ? 'teach' : 'success',
  };
}

export function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<RecentSearch[]>([]);
  const [results, setResults] = useState<SearchResultDto | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (trimmedQuery.length < 2) {
      setResults(null);
      setSearching(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setSearching(true);
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const response = await searchService.search(trimmedQuery);
        if (!cancelled) setResults(response);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Search is unavailable right now.');
          setResults(null);
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  const rememberSearch = (value: string) => {
    const label = value.trim();
    if (!label) return;
    setRecent((current) => {
      const withoutDuplicate = current.filter(
        (item) => item.label.toLowerCase() !== label.toLowerCase()
      );
      return [{ id: label.toLowerCase(), label }, ...withoutDuplicate].slice(0, 5);
    });
  };

  const selectQuery = (value: string) => {
    setQuery(value);
    rememberSearch(value);
  };

  const people = useMemo(() => (results?.people ?? []).map(toPerson), [results]);

  const mappedIntent =
    results && results.skills.length > 0
      ? results.skills
          .slice(0, 3)
          .map((skill) => skill.name)
          .join(', ')
      : undefined;

  const openSkill = (skill: SkillDto) => {
    router.push({ pathname: '/skill/[id]', params: { id: String(skill.id) } });
  };
  const openMatches = () => router.push('/matches');
  const openDiscussion = () => {
    const post = results?.posts[0];
    if (post) {
      router.push({ pathname: '/post/[id]', params: { id: post.id } });
      return;
    }
    router.push('/community');
  };
  const openPerson = (person: Person) => {
    if (!user) {
      router.push('/welcome');
      return;
    }
    router.push({ pathname: '/swap/[id]', params: { id: person.id } });
  };

  const hasQuery = trimmedQuery.length >= 2;

  return (
    <View style={styles.screen}>
      <SearchHeader
        query={query}
        mappedIntent={mappedIntent}
        onChangeQuery={setQuery}
        onClear={() => setQuery('')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        {hasQuery ? (
          <>
            {searching ? (
              <View style={styles.loading}>
                <ActivityIndicator color={Palette.primary} />
                <AppText variant="bodySmall" color={Palette.textMuted}>
                  Searching skills, people, and discussions...
                </AppText>
              </View>
            ) : null}

            {error ? (
              <Card style={styles.stateCard}>
                <AppText variant="bodySmall" color={Palette.danger} align="center">
                  {error}
                </AppText>
              </Card>
            ) : null}

            {!searching && !error && results ? (
              <>
                <RelatedSkillsSection skills={results.skills} onSelect={openSkill} />
                <MentorsSection people={people} onMatch={openPerson} onSeeAll={openMatches} />
                <DiscussionSection post={results.posts[0]} onPress={openDiscussion} />
                {results.skills.length === 0 &&
                people.length === 0 &&
                results.posts.length === 0 ? (
                  <Card style={styles.stateCard}>
                    <AppText variant="subtitle" weight="700">
                      No matches yet
                    </AppText>
                    <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                      Try a broader skill name like design, coding, or photography.
                    </AppText>
                  </Card>
                ) : null}
              </>
            ) : null}
          </>
        ) : (
          <RecentSearchesSection
            recent={recent}
            onSelect={selectQuery}
            onRemove={(id) => setRecent((current) => current.filter((item) => item.id !== id))}
            onClear={() => setRecent([])}
          />
        )}
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
  loading: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
