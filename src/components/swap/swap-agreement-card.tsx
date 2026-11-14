import { CheckCircle2, Compass, School, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SwapWorkspace } from '@/types';

type SwapAgreementCardProps = {
  agreement: SwapWorkspace['agreement'];
  partnerName: string;
  matchPercent?: number;
  statusLabel?: string;
};

export function SwapAgreementCard({
  agreement,
  partnerName,
  matchPercent,
  statusLabel = 'Swap accepted',
}: SwapAgreementCardProps) {
  const YourSkillIcon = SKILL_ICONS[agreement.yourSkillIcon];
  const PartnerSkillIcon = SKILL_ICONS[agreement.partnerSkillIcon];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.status}>
          <CheckCircle2 color={Palette.success} size={17} strokeWidth={2.4} />
          <AppText variant="caption" color={Palette.successText} weight="700">
            {statusLabel} with {partnerName.split(' ')[0]}
          </AppText>
        </View>
        {matchPercent != null ? (
          <View style={styles.matchPill}>
            <Sparkles color={Palette.primary} size={12} strokeWidth={2.2} />
            <AppText variant="caption" color={Palette.primary} weight="700">
              {matchPercent}% match
            </AppText>
          </View>
        ) : null}
      </View>

      <View style={styles.exchange}>
        <View style={styles.skill}>
          <View style={styles.labelRow}>
            <School color={Palette.teachText} size={13} strokeWidth={2.2} />
            <AppText variant="caption" color={Palette.teachText} weight="700">
              YOU TEACH
            </AppText>
          </View>
          <View style={styles.skillRow}>
            <YourSkillIcon color={Palette.teachText} size={16} strokeWidth={2.2} />
            <AppText variant="bodySmall" weight="600" numberOfLines={2} style={styles.skillText}>
              {agreement.yourSkill}
            </AppText>
          </View>
        </View>

        <View style={styles.connector}>
          <View style={styles.connectorLine} />
          <View style={styles.connectorDot} />
          <View style={styles.connectorLine} />
        </View>

        <View style={styles.skill}>
          <View style={styles.labelRow}>
            <Compass color={Palette.learnText} size={13} strokeWidth={2.2} />
            <AppText variant="caption" color={Palette.learnText} weight="700">
              YOU LEARN
            </AppText>
          </View>
          <View style={styles.skillRow}>
            <PartnerSkillIcon color={Palette.learnText} size={16} strokeWidth={2.2} />
            <AppText variant="bodySmall" weight="600" numberOfLines={2} style={styles.skillText}>
              {agreement.partnerSkill}
            </AppText>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 14,
    borderRadius: Radius.xl,
    backgroundColor: Palette.teachSoft,
    borderColor: Palette.teachBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.lavender,
  },
  exchange: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.two,
  },
  skill: {
    flex: 1,
    gap: 5,
    padding: 9,
    borderRadius: Radius.md,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  skillText: {
    flex: 1,
  },
  connector: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  connectorLine: {
    width: 1,
    flex: 1,
    backgroundColor: Palette.borderStrong,
  },
  connectorDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Palette.primary,
  },
});
