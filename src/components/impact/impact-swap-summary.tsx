import { CheckCircle2, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SkillIcon } from '@/types';

type ImpactSwapSummaryProps = {
  partner: {
    name: string;
    avatarUrl: string;
    role: string;
    matchPercent?: number;
  };
  agreement: {
    yourSkill: string;
    yourSkillIcon: SkillIcon;
    partnerSkill: string;
    partnerSkillIcon: SkillIcon;
  };
};

export function ImpactSwapSummary({ partner, agreement }: ImpactSwapSummaryProps) {
  const YourSkillIcon = SKILL_ICONS[agreement.yourSkillIcon];
  const PartnerSkillIcon = SKILL_ICONS[agreement.partnerSkillIcon];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Avatar
          name={partner.name}
          uri={partner.avatarUrl}
          size={52}
          ringColor={Palette.successRing}
        />
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <AppText variant="subtitle" weight="700" numberOfLines={1} style={styles.name}>
              {partner.name}
            </AppText>
            {partner.matchPercent != null ? (
              <View style={styles.matchPill}>
                <Sparkles color={Palette.primary} size={11} strokeWidth={2.2} />
                <AppText variant="caption" color={Palette.primary} weight="700">
                  {partner.matchPercent}%
                </AppText>
              </View>
            ) : null}
          </View>
          <AppText variant="caption" color={Palette.textMuted}>
            {partner.role}
          </AppText>
          <View style={styles.completeRow}>
            <CheckCircle2 color={Palette.success} size={13} strokeWidth={2.4} />
            <AppText variant="caption" color={Palette.successText} weight="700">
              Exchange completed just now
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.exchange}>
        <View style={styles.skill}>
          <YourSkillIcon color={Palette.teachText} size={16} strokeWidth={2.2} />
          <View style={styles.skillText}>
            <AppText variant="caption" color={Palette.textMuted}>
              You taught
            </AppText>
            <AppText variant="bodySmall" weight="700" numberOfLines={1}>
              {agreement.yourSkill}
            </AppText>
          </View>
        </View>

        <View style={styles.skillDivider} />

        <View style={styles.skill}>
          <PartnerSkillIcon color={Palette.learnText} size={16} strokeWidth={2.2} />
          <View style={styles.skillText}>
            <AppText variant="caption" color={Palette.textMuted}>
              You learned
            </AppText>
            <AppText variant="bodySmall" weight="700" numberOfLines={1}>
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
    gap: 14,
    padding: 14,
    borderRadius: Radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  identity: {
    flex: 1,
    gap: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    flexShrink: 1,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Palette.lavender,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  exchange: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  skill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  skillText: {
    flex: 1,
    gap: 1,
  },
  skillDivider: {
    width: 1,
    backgroundColor: Palette.border,
  },
});

