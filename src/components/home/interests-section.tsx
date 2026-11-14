import { Sparkles } from 'lucide-react-native';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SectionHeader } from '@/components/ui/section-header';
import { SkillChip } from '@/components/ui/skill-chip';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { AppText } from '@/components/ui/app-text';
import { Palette, Spacing } from '@/constants/theme';
import type { InterestDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';

type InterestsSectionProps = {
  interests: InterestDto[];
  onManage: () => void;
};

export function InterestsSection({ interests, onManage }: InterestsSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader
        title="Your Interests"
        icon={Sparkles}
        iconColor={Palette.primary}
        actionLabel="Manage"
        onActionPress={onManage}
      />
      {interests.length === 0 ? (
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Pick skills during onboarding to personalize this feed.
        </AppText>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
          contentContainerStyle={styles.chips}>
          {interests.map(({ skill, score }) => {
            const icon = iconForSkill(skill.name, skill.category);
            return (
              <SkillChip
                key={skill.id}
                label={`${skill.name} · ${Math.round(score)}`}
                icon={SKILL_ICONS[icon]}
                iconColor={Palette.accent}
                selected
                onPress={onManage}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: Spacing.three,
    gap: 10,
  },
  scroll: {
    marginHorizontal: -Spacing.three,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingRight: Spacing.four,
  },
});
