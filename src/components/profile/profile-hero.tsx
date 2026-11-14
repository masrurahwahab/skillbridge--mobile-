import { Check, MapPin, QrCode, Star } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { UserProfile } from '@/types';

type ProfileHeroProps = {
  profile: UserProfile;
  onEdit: () => void;
  onQr: () => void;
  primaryLabel?: string;
};

export function ProfileHero({ profile, onEdit, onQr, primaryLabel = 'Edit Profile' }: ProfileHeroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarRow}>
        <View>
          <Avatar name={profile.name} uri={profile.avatarUrl} size={80} ringColor={Palette.primaryRing} />
          <View style={styles.verifiedBadge}>
            <Check color={Palette.white} size={12} strokeWidth={3} />
          </View>
        </View>

        <View style={styles.heroActions}>
          <Button label={primaryLabel} variant="ghost" size="sm" onPress={onEdit} />
          <IconButton icon={QrCode} accessibilityLabel="Show profile QR code" size={36} onPress={onQr} />
        </View>
      </View>

      <View style={styles.identity}>
        <View style={styles.nameRow}>
          <AppText variant="headlineSmall" weight="700">
            {profile.name}
          </AppText>
          <View style={styles.partnerBadge}>
            <AppText variant="caption" color={Palette.accent} weight="700">
              {profile.badge}
            </AppText>
          </View>
        </View>

        <AppText variant="bodySmall" color={Palette.textMuted}>
          {profile.handle} • {profile.role}
        </AppText>

        <View style={styles.locationRow}>
          <MapPin color={Palette.textMuted} size={14} strokeWidth={2.2} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            {profile.location}
          </AppText>
        </View>

        <AppText variant="body" color={Palette.text} style={styles.bio}>
          {profile.bio}
        </AppText>
      </View>

      <View style={styles.metrics}>
        {profile.stats.map((stat, index) => (
          <View
            key={stat.id}
            style={[styles.metric, index > 0 && styles.metricDivider]}>
            <View style={styles.metricValueRow}>
              <AppText
                variant="title"
                weight="700"
                color={stat.tone === 'success' ? Palette.success : Palette.primary}>
                {stat.value}
              </AppText>
              {stat.id === 'rating' ? (
                <Star color={Palette.success} fill={Palette.success} size={13} />
              ) : null}
            </View>
            <AppText variant="bodySmall" color={Palette.textMuted} numberOfLines={1}>
              {stat.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  verifiedBadge: {
    position: 'absolute',
    right: 1,
    bottom: 1,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.success,
    borderWidth: 2,
    borderColor: Palette.surface,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  identity: {
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  partnerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.accentSubtle,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bio: {
    marginTop: Spacing.two,
  },
  metrics: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    paddingVertical: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  metricDivider: {
    borderLeftWidth: 1,
    borderLeftColor: Palette.border,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
});
