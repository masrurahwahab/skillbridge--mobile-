import { BadgeCheck, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { impactService } from '@/services/impact.service';

export function WelcomeHero() {
  const [memberCount, setMemberCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    impactService
      .getStats()
      .then((stats) => {
        if (active) setMemberCount(stats.totalUsers);
      })
      .catch(() => {
        if (active) setMemberCount(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.teachBlob} />
      <View style={styles.learnBlob} />

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <View style={styles.reciprocalBadge}>
            <AppText variant="caption" color={Palette.white} weight="700" style={styles.badgeText}>
              Reciprocal Learning
            </AppText>
          </View>
          <View style={styles.freeBadge}>
            <BadgeCheck color={Palette.success} size={15} strokeWidth={2.4} />
            <AppText variant="caption" color={Palette.success} weight="700">
              100% Free
            </AppText>
          </View>
        </View>

        <AppText variant="headlineSmall" weight="700">
          Trade what you know for what you want to master.
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Connect directly with designers, coders, writers, and artists. No pricey tutoring
          subscriptions—just genuine peer knowledge exchange.
        </AppText>

        <View style={styles.socialProof}>
          <View style={styles.avatars}>
            <View style={styles.memberIcon}>
              <Users color={Palette.primary} size={16} strokeWidth={2.2} />
            </View>
          </View>
          <AppText variant="bodySmall" weight="600" style={styles.socialText}>
            {memberCount != null
              ? `Join ${memberCount.toLocaleString()} skill traders`
              : 'Join a growing community of skill traders'}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: Radius.lg,
    padding: Spacing.three + Spacing.one,
  },
  teachBlob: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    top: -78,
    left: -52,
    backgroundColor: Palette.teachBg,
  },
  learnBlob: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    bottom: -92,
    right: -58,
    backgroundColor: Palette.learnBg,
  },
  content: {
    gap: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: 2,
  },
  reciprocalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    backgroundColor: Palette.primary,
  },
  badgeText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatar: {
    marginLeft: -8,
  },
  memberIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.lavender,
  },
  socialText: {
    flexShrink: 1,
  },
});
