import { ArrowRight, Bolt } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { Person } from '@/types';

type PickedForYouCardProps = {
  person?: Person;
  reason?: string;
  onViewMatches: () => void;
};

export function PickedForYouCard({ person, reason, onViewMatches }: PickedForYouCardProps) {
  return (
    <View style={styles.section}>
      <Card padded={false} style={styles.card}>
        <View pointerEvents="none" style={styles.glowClip}>
          <View style={styles.glowLarge} />
          <View style={styles.glowSmall} />
        </View>

        <View style={styles.topRow}>
          <View style={styles.badge}>
            <Bolt color={Palette.white} size={13} strokeWidth={2.4} />
            <AppText variant="overline" color={Palette.white} style={styles.badgeText}>
              Picked for You
            </AppText>
          </View>
          <AppText variant="caption" color={Palette.textMuted}>
            {person ? `${person.matchPercent}% Match` : 'Personalized'}
          </AppText>
        </View>

        <AppText variant="subtitle" weight="700" style={styles.title}>
          {person ? `Swap skills with ${person.name.split(' ')[0]}` : 'Find your next skill swap'}
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted} style={styles.description}>
          {reason ??
            'Complete your skills and interests to unlock reciprocal matches picked for you.'}
        </AppText>

        <View style={styles.footer}>
          <View style={styles.avatarStack}>
            {person ? (
              <Avatar
                name={person.name}
                uri={person.avatarUrl}
                size={28}
                ringColor={Palette.surface}
              />
            ) : null}
          </View>
          <Button
            variant="link"
            size="sm"
            label="View Matches"
            icon={ArrowRight}
            iconPosition="right"
            onPress={onViewMatches}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.three,
  },
  card: {
    padding: 14,
    backgroundColor: Palette.lavender,
    borderColor: '#DDE3FF',
  },
  glowClip: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: Radius.xxl,
    overflow: 'hidden',
  },
  glowLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    top: -90,
    right: -50,
    backgroundColor: 'rgba(99, 101, 240, 0.12)',
  },
  glowSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: -50,
    left: -20,
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.primary,
  },
  badgeText: {
    letterSpacing: 0.6,
  },
  title: {
    marginTop: 10,
  },
  description: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
