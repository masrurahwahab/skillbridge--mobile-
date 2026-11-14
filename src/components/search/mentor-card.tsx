import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius } from '@/constants/theme';
import type { Person } from '@/types';

type MentorCardProps = {
  person: Person;
  onMatch: (person: Person) => void;
};

export function MentorCard({ person, onMatch }: MentorCardProps) {
  const isTeachBadge = person.badgeTone === 'teach';

  return (
    <Card padded={false} style={styles.card}>
      <Avatar
        name={person.name}
        uri={person.avatarUrl}
        size={48}
        ringColor={isTeachBadge ? Palette.primaryRing : Palette.successRing}
      />

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <AppText variant="subtitle" weight="700" numberOfLines={1} style={styles.name}>
            {person.name}
          </AppText>
          {person.badge ? (
            <View style={[styles.badge, isTeachBadge ? styles.teachBadge : styles.successBadge]}>
              <AppText
                variant="caption"
                color={isTeachBadge ? Palette.teachText : Palette.success}
                weight="700"
                numberOfLines={1}>
                {person.badge}
              </AppText>
            </View>
          ) : null}
        </View>
        <AppText variant="caption" color={Palette.teachText} weight="600" numberOfLines={1}>
          Teaches: {person.teaches}
        </AppText>
        <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
          Looking to learn: {person.wants}
        </AppText>
      </View>

      <Button
        label="Connect"
        size="sm"
        onPress={() => onMatch(person)}
        accessibilityLabel={`Connect with ${person.name}`}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: Radius.xl,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 6,
    rowGap: 2,
  },
  name: {
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  successBadge: {
    backgroundColor: Palette.successSoft,
  },
  teachBadge: {
    backgroundColor: Palette.teachBg,
  },
});
