import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { SkillChip } from '@/components/ui/skill-chip';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette } from '@/constants/theme';
import type { RelatedSkill } from '@/types';

type SkillRelatedSectionProps = {
  skills: RelatedSkill[];
  onSelect: (skill: RelatedSkill) => void;
};

export function SkillRelatedSection({ skills, onSelect }: SkillRelatedSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="subtitle" weight="700">
          Related Skills
        </AppText>
        <AppText variant="caption" color={Palette.textMuted}>
          Tap to explore
        </AppText>
      </View>

      <View style={styles.chips}>
        {skills.map((skill) => (
          <SkillChip
            key={skill.id}
            label={skill.label}
            icon={SKILL_ICONS[skill.icon]}
            tone="neutral"
            onPress={() => onSelect(skill)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
