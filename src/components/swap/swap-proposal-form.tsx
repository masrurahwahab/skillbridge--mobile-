import { StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SKILL_ICONS } from '@/components/ui/skill-icon';
import { SkillChip } from '@/components/ui/skill-chip';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SkillOption } from '@/types';
import type { SkillDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';

type SwapProposalFormProps = {
  partnerName: string;
  mySkills: SkillOption[];
  partnerSkills: SkillDto[];
  teachingId?: string;
  learningId?: string;
  message: string;
  submitting?: boolean;
  onChangeTeaching: (skillId: string) => void;
  onChangeLearning: (skillId: string) => void;
  onChangeMessage: (value: string) => void;
  onSubmit: () => void;
  onAddSkills: () => void;
};

export function SwapProposalForm({
  partnerName,
  mySkills,
  partnerSkills,
  teachingId,
  learningId,
  message,
  submitting,
  onChangeTeaching,
  onChangeLearning,
  onChangeMessage,
  onSubmit,
  onAddSkills,
}: SwapProposalFormProps) {
  const canSubmit = Boolean(teachingId && learningId && !submitting);

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <AppText variant="title" weight="700">
          Propose a swap with {partnerName.split(' ')[0]}
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Choose one skill you can teach and one you want to learn. Both of you spend one hour
          per exchange.
        </AppText>

        <View style={styles.group}>
          <AppText variant="label" weight="700" color={Palette.teachText}>
            YOU TEACH
          </AppText>
          {mySkills.length > 0 ? (
            <View style={styles.chips}>
              {mySkills.map((skill) => (
                <SkillChip
                  key={skill.id}
                  label={skill.label}
                  icon={SKILL_ICONS[skill.icon]}
                  tone="teach"
                  selected={teachingId === skill.id}
                  onPress={() => onChangeTeaching(skill.id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.missing}>
              <AppText variant="bodySmall" color={Palette.textMuted}>
                Add a skill you can teach before proposing a swap.
              </AppText>
              <Button label="Add skills" size="sm" variant="secondary" onPress={onAddSkills} />
            </View>
          )}
        </View>

        <View style={styles.group}>
          <AppText variant="label" weight="700" color={Palette.learnText}>
            YOU LEARN
          </AppText>
          {partnerSkills.length > 0 ? (
            <View style={styles.chips}>
              {partnerSkills.map((skill) => (
                <SkillChip
                  key={skill.id}
                  label={skill.name}
                  icon={SKILL_ICONS[iconForSkill(skill.name, skill.category)]}
                  tone="learn"
                  selected={learningId === String(skill.id)}
                  onPress={() => onChangeLearning(String(skill.id))}
                />
              ))}
            </View>
          ) : (
            <AppText variant="bodySmall" color={Palette.textMuted}>
              {partnerName.split(' ')[0]} has not listed a skill to teach yet.
            </AppText>
          )}
        </View>

        <TextInput
          value={message}
          onChangeText={onChangeMessage}
          placeholder="Add a short note about what you want to practice..."
          placeholderTextColor={Palette.textMuted}
          multiline
          style={styles.input}
        />

        <Button
          label={submitting ? 'Sending proposal...' : 'Send swap proposal'}
          fullWidth
          disabled={!canSubmit}
          onPress={onSubmit}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.three,
  },
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
  },
  group: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  missing: {
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  input: {
    minHeight: 84,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    padding: Spacing.two,
    color: Palette.text,
    textAlignVertical: 'top',
    fontSize: 14,
  },
});
