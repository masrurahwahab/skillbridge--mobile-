import { Compass, School } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { SkillChip } from '@/components/ui/skill-chip';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { OnboardingSkillOption } from '@/types';

type SkillSelectionSectionProps = {
  stepNumber: number;
  title: string;
  description: string;
  options: OnboardingSkillOption[];
  selectedIds: string[];
  tone: 'teach' | 'learn';
  onToggle: (id: string) => void;
};

export function SkillSelectionSection({
  stepNumber,
  title,
  description,
  options,
  selectedIds,
  tone,
  onToggle,
}: SkillSelectionSectionProps) {
  const isTeach = tone === 'teach';
  const Icon = isTeach ? School : Compass;
  const toneText = isTeach ? Palette.teachText : Palette.learnText;
  const selectedColor = isTeach ? Palette.primary : Palette.accent;

  return (
    <View
      style={[
        styles.section,
        isTeach ? styles.teachSection : styles.learnSection,
      ]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, isTeach ? styles.teachIcon : styles.learnIcon]}>
          <Icon color={toneText} size={16} strokeWidth={2.2} />
        </View>
        <AppText variant="subtitle" weight="700" color={toneText} style={styles.title}>
          {stepNumber}. {title}
        </AppText>
      </View>

      <AppText variant="bodySmall" color={Palette.textMuted}>
        {description}
      </AppText>

      <View style={styles.chips}>
        {options.map((option) => (
          <SkillChip
            key={option.id}
            label={option.label}
            icon={SKILL_ICONS[option.icon]}
            selected={selectedIds.includes(option.id)}
            selectedColor={selectedColor}
            showSelectedCheck
            onPress={() => onToggle(option.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  teachSection: {
    backgroundColor: Palette.teachSoft,
    borderColor: Palette.teachBorder,
  },
  learnSection: {
    backgroundColor: Palette.learnSoft,
    borderColor: Palette.learnBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teachIcon: {
    backgroundColor: Palette.teachBg,
  },
  learnIcon: {
    backgroundColor: Palette.learnBg,
  },
  title: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
