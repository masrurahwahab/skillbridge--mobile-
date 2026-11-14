import { BadgeCheck, Lightbulb, Repeat2, Sparkles, Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SkillMatch } from '@/types';

import { MatchSkillExchange } from './match-skill-exchange';

type MatchCardProps = {
  match: SkillMatch;
  onConnect: (match: SkillMatch) => void;
  onViewProfile: (match: SkillMatch) => void;
};

export function MatchCard({ match, onConnect, onViewProfile }: MatchCardProps) {
  const isWarm = match.insightTone === 'warm';

  return (
    <Card padded={false} style={[styles.card, match.topPick && styles.topPickCard]}>
      <View style={styles.topRow}>
        <View style={styles.matchBadge}>
          <Sparkles color={Palette.success} size={13} strokeWidth={2.4} />
          <AppText variant="caption" color={Palette.success} weight="700" numberOfLines={1}>
            {match.matchLabel}
          </AppText>
        </View>
        <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
          {match.activity}
        </AppText>
      </View>

      <View style={styles.profileRow}>
        <Avatar
          name={match.name}
          uri={match.avatarUrl}
          size={56}
          ringColor={match.topPick ? Palette.accentRing : Palette.border}
        />
        <View style={styles.profileCopy}>
          <View style={styles.nameRow}>
            <AppText variant="title" weight="700" numberOfLines={1} style={styles.name}>
              {match.name}
            </AppText>
            {match.verified ? (
              <BadgeCheck color={Palette.accent} size={17} strokeWidth={2.4} />
            ) : null}
          </View>
          <AppText variant="bodySmall" color={Palette.textMuted} numberOfLines={1}>
            {match.role} • {match.location}
          </AppText>
          <View style={styles.ratingRow}>
            <Star color={Palette.warning} fill={Palette.warning} size={13} />
            <AppText
              variant="caption"
              color={Palette.textMuted}
              numberOfLines={1}
              style={styles.ratingText}>
              {match.rating.toFixed(1)} ({match.exchangeCount} exchanges)
              {match.completionRate ? ` • ${match.completionRate}% completion rate` : ''}
            </AppText>
          </View>
        </View>
      </View>

      <MatchSkillExchange teaches={match.teaches} wants={match.wants} />

      <View style={[styles.insight, isWarm ? styles.insightWarm : styles.insightNeutral]}>
        <Lightbulb
          color={isWarm ? Palette.warning : Palette.primary}
          size={17}
          strokeWidth={2.2}
        />
        <AppText
          variant="bodySmall"
          color={isWarm ? Palette.warningText : Palette.text}
          style={styles.insightCopy}>
          <AppText
            variant="bodySmall"
            color={isWarm ? Palette.warningText : Palette.text}
            weight="700">
            Why you match:{' '}
          </AppText>
          {match.insight}
        </AppText>
      </View>

      <View style={styles.actions}>
        <Button
          label="Connect & Exchange"
          size="sm"
          icon={Repeat2}
          onPress={() => onConnect(match)}
          style={styles.primaryAction}
        />
        <Button
          label="View Profile"
          variant="ghost"
          size="sm"
          onPress={() => onViewProfile(match)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    padding: Spacing.three,
  },
  topPickCard: {
    borderWidth: 2,
    borderColor: Palette.accentRing,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  matchBadge: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.successSoft,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileCopy: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  name: {
    flexShrink: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 1,
  },
  ratingText: {
    flexShrink: 1,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  insightWarm: {
    backgroundColor: Palette.warningSoft,
    borderColor: Palette.warningBorder,
  },
  insightNeutral: {
    backgroundColor: Palette.background,
    borderColor: Palette.border,
  },
  insightCopy: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  primaryAction: {
    flex: 1,
  },
});
