import { Check, QrCode, Repeat2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Palette, Radius, Shadows, Spacing } from '@/constants/theme';
import type { UserProfile } from '@/types';

type ShareProfileCardProps = {
  profile: UserProfile;
};

export function ShareProfileCard({ profile }: ShareProfileCardProps) {
  const offers = profile.teachSkills
    .slice(0, 2)
    .map((skill) => skill.label)
    .join(' & ');
  const wants = profile.learnSkills
    .slice(0, 2)
    .map((skill) => skill.label)
    .join(' & ');

  return (
    <View style={styles.card}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.brand}>
        <View style={styles.brandMark}>
          <Repeat2 color={Palette.white} size={15} strokeWidth={2.4} />
        </View>
        <AppText variant="subtitle" color={Palette.white} weight="700">
          SkillBridge
        </AppText>
      </View>

      <View style={styles.avatarWrap}>
        <Avatar
          name={profile.name}
          uri={profile.avatarUrl}
          size={80}
          ringColor={Palette.overlay}
        />
        <View style={styles.verifiedBadge}>
          <Check color={Palette.white} size={12} strokeWidth={3} />
        </View>
      </View>

      <View style={styles.identity}>
        <AppText variant="headlineSmall" color={Palette.white} weight="700">
          {profile.name}
        </AppText>
        <AppText variant="bodySmall" color={Palette.lavender}>
          {profile.handle}
        </AppText>
      </View>

      <View style={styles.exchange}>
        <View style={styles.exchangeRow}>
          <AppText variant="caption" color={Palette.lavender}>
            Offers:
          </AppText>
          <AppText variant="caption" color={Palette.white} weight="700" style={styles.exchangeValue}>
            {offers}
          </AppText>
        </View>
        <View style={styles.exchangeDivider} />
        <View style={styles.exchangeRow}>
          <AppText variant="caption" color={Palette.lavender}>
            Wants:
          </AppText>
          <AppText variant="caption" color={Palette.white} weight="700" style={styles.exchangeValue}>
            {wants}
          </AppText>
        </View>
      </View>

      <View style={styles.qrCard}>
        <QrCode color={Palette.primaryDark} size={102} strokeWidth={1.8} />
        <AppText variant="overline" color={Palette.textMuted} align="center">
          SCAN TO PROPOSE SWAP
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.xxl,
    backgroundColor: Palette.primaryDark,
    ...Shadows.raised,
  },
  glowTop: {
    position: 'absolute',
    top: -58,
    right: -42,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Palette.secondary,
    opacity: 0.45,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -70,
    left: -44,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Palette.accent,
    opacity: 0.24,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMark: {
    width: 24,
    height: 24,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.overlay,
  },
  avatarWrap: {
    position: 'relative',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.success,
    borderWidth: 2,
    borderColor: Palette.primaryDark,
  },
  identity: {
    alignItems: 'center',
    gap: 1,
  },
  exchange: {
    width: '100%',
    gap: 7,
    padding: 11,
    borderRadius: Radius.lg,
    backgroundColor: Palette.overlaySoft,
    borderWidth: 1,
    borderColor: Palette.overlayBorder,
  },
  exchangeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  exchangeValue: {
    flex: 1,
    textAlign: 'right',
  },
  exchangeDivider: {
    height: 1,
    backgroundColor: Palette.overlayBorder,
  },
  qrCard: {
    alignItems: 'center',
    gap: 5,
    padding: 10,
    borderRadius: Radius.lg,
    backgroundColor: Palette.surface,
    ...Shadows.card,
  },
});
