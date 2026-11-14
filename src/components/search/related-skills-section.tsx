import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { SkillChip } from '@/components/ui/skill-chip';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette } from '@/constants/theme';
import type { SkillDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';

type RelatedSkillsSectionProps = {
  skills: SkillDto[];
  onSelect: (skill: SkillDto) => void;
};

export function RelatedSkillsSection({ skills, onSelect }: RelatedSkillsSectionProps) {
  if (skills.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <AppText variant="subtitle" weight="700">
          Related Skills Found
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted}>
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'}
        </AppText>
      </View>

      <View style={styles.chips}>
        {skills.map((skill, index) => {
          const icon = iconForSkill(skill.name, skill.category);
          return (
            <SkillChip
              key={skill.id}
              label={skill.name}
              icon={SKILL_ICONS[icon]}
              selected={index === 0}
              tone={index === 0 ? 'teach' : 'default'}
              iconColor={index === 0 ? Palette.primary : Palette.accent}
              onPress={() => onSelect(skill)}
            />
          );
        })}
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
