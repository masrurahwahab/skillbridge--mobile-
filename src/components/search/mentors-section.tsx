import { StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/ui/section-header';
import type { Person } from '@/types';

import { MentorCard } from './mentor-card';

type MentorsSectionProps = {
  people: Person[];
  onMatch: (person: Person) => void;
  onSeeAll: () => void;
};

export function MentorsSection({ people, onMatch, onSeeAll }: MentorsSectionProps) {
  if (people.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="People & Mentors"
        actionLabel={`View all ${people.length}`}
        onActionPress={onSeeAll}
      />
      <View style={styles.list}>
        {people.map((person) => (
          <MentorCard key={person.id} person={person} onMatch={onMatch} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  list: {
    gap: 8,
  },
});
