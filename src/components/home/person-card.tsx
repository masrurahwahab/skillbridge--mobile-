import { Repeat2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SkillIconView } from '@/components/ui/skill-icon';
import { Palette, Radius } from '@/constants/theme';
import type { Person } from '@/types';

type PersonCardProps = {
  person: Person;
  onConnect: (person: Person) => void;
};

export function PersonCard({ person, onConnect }: PersonCardProps) {
  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.header}>
        <Avatar
          name={person.name}
          uri={person.avatarUrl}
          size={44}
          ringColor="rgba(16, 185, 129, 0.28)"
        />
        <View style={styles.identity}>
          <AppText variant="subtitle" weight="700" numberOfLines={1}>
            {person.name}
          </AppText>
          <View style={styles.matchBadge}>
            <AppText variant="caption" color={Palette.success} weight="700">
              {person.matchPercent}% Match
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.skills}>
        <View style={[styles.skillRow, styles.teachRow]}>
          <SkillIconView name={person.teachesIcon} color={Palette.teachText} />
          <AppText
            variant="caption"
            color={Palette.teachText}
            weight="600"
            numberOfLines={1}
            style={styles.skillText}>
            Teaches: {person.teaches}
          </AppText>
        </View>
        <View style={[styles.skillRow, styles.learnRow]}>
          <SkillIconView name={person.wantsIcon} color={Palette.learnText} />
          <AppText
            variant="caption"
            color={Palette.learnText}
            weight="600"
            numberOfLines={1}
            style={styles.skillText}>
            Wants: {person.wants}
          </AppText>
        </View>
      </View>

      <Button
        label="Connect"
        size="sm"
        icon={Repeat2}
        fullWidth
        onPress={() => onConnect(person)}
        accessibilityLabel={`Connect with ${person.name}`}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 230,
    minHeight: 210,
    padding: 14,
    gap: 12,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  matchBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
    backgroundColor: Palette.successSoft,
  },
  skills: {
    gap: 6,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  teachRow: {
    backgroundColor: Palette.teachBg,
  },
  learnRow: {
    backgroundColor: Palette.learnBg,
  },
  skillText: {
    flex: 1,
  },
});
