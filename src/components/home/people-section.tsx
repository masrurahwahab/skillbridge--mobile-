import { ScrollView, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/ui/section-header';
import { Spacing } from '@/constants/theme';
import type { Person } from '@/types';

import { PersonCard } from './person-card';

type PeopleSectionProps = {
  title: string;
  subtitle?: string;
  people: Person[];
  onSeeAll: () => void;
  onConnect: (person: Person) => void;
};

export function PeopleSection({
  title,
  subtitle,
  people,
  onSeeAll,
  onConnect,
}: PeopleSectionProps) {
  if (people.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        actionLabel="See all"
        onActionPress={onSeeAll}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.cards}>
        {people.map((person) => (
          <PersonCard key={person.id} person={person} onConnect={onConnect} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.three,
    gap: 10,
  },
  scroll: {
    marginHorizontal: -Spacing.three,
  },
  cards: {
    gap: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingRight: Spacing.four,
  },
});
