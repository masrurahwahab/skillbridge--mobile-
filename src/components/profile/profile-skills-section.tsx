import { Compass, School, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { SkillChip } from '@/components/ui/skill-chip';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette } from '@/constants/theme';
import type { SkillOption } from '@/types';

type ProfileSkillsSectionProps = {
  title: string;
  countLabel: string;
  skills: SkillOption[];
  tone: 'teach' | 'learn';
  onSkillPress?: (skill: SkillOption) => void;
};

export function ProfileSkillsSection({
  title,
  countLabel,
  skills,
  tone,
  onSkillPress,
}: ProfileSkillsSectionProps) {
  const isTeach = tone === 'teach';
  const Icon: LucideIcon = isTeach ? School : Compass;
  const toneColor = isTeach ? Palette.teachText : Palette.learnText;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Icon color={toneColor} size={18} strokeWidth={2.2} />
          <AppText variant="subtitle" weight="700">
            {title}
          </AppText>
        </View>
        <AppText variant="caption" color={toneColor} weight="600">
          {countLabel}
        </AppText>
      </View>

      <View style={styles.chips}>
        {skills.map((skill) => (
          <SkillChip
            key={skill.id}
            label={skill.label}
            icon={SKILL_ICONS[skill.icon]}
            tone={tone}
            onPress={onSkillPress ? () => onSkillPress(skill) : undefined}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
