import { Sparkles, Star, Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { SkillLearner, SkillTeacher } from '@/types';

type SkillPeopleSectionProps = {
  teachers: SkillTeacher[];
  learners: SkillLearner[];
  teacherCount: number;
  learnerCount: number;
  onConnect: () => void;
};

export function SkillPeopleSection({
  teachers,
  learners,
  teacherCount,
  learnerCount,
  onConnect,
}: SkillPeopleSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Sparkles color={Palette.primary} size={18} strokeWidth={2.2} />
          <AppText variant="subtitle" weight="700">
            Top Teachers
          </AppText>
        </View>
        <AppText variant="caption" color={Palette.primary} weight="600">
          {teacherCount} available
        </AppText>
      </View>

      <Card padded={false} style={styles.card}>
        {teachers.map((teacher, index) => (
          <View
            key={teacher.id}
            style={[styles.teacherRow, index > 0 && styles.rowBorder]}>
            <Avatar
              name={teacher.name}
              uri={teacher.avatarUrl}
              size={46}
              ringColor={Palette.accentRing}
            />
            <View style={styles.teacherInfo}>
              <AppText variant="body" weight="700" numberOfLines={1}>
                {teacher.name}
              </AppText>
              <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                {teacher.role}
              </AppText>
              <View style={styles.metaRow}>
                <Star color={Palette.warning} fill={Palette.warning} size={12} />
                <AppText variant="caption" color={Palette.textMuted} weight="600">
                  {teacher.rating.toFixed(2)} · {teacher.sessions} sessions
                </AppText>
              </View>
            </View>
            <View style={styles.teacherAction}>
              {teacher.matchPercent != null ? (
                <View style={styles.matchPill}>
                  <AppText variant="caption" color={Palette.success} weight="700">
                    {teacher.matchPercent}%
                  </AppText>
                </View>
              ) : null}
              <Button
                label="Match"
                size="sm"
                variant="secondary"
                onPress={onConnect}
                accessibilityLabel={`Match with ${teacher.name}`}
              />
            </View>
          </View>
        ))}
      </Card>

      <View style={styles.learnersHeader}>
        <View style={styles.titleRow}>
          <Users color={Palette.learnText} size={18} strokeWidth={2.2} />
          <AppText variant="subtitle" weight="700">
            Learning Now
          </AppText>
        </View>
        <AppText variant="caption" color={Palette.learnText} weight="600">
          {learnerCount} learners
        </AppText>
      </View>

      <Card padded={false} style={styles.card}>
        {learners.map((learner, index) => (
          <View
            key={learner.id}
            style={[styles.learnerRow, index > 0 && styles.rowBorder]}>
            <Avatar name={learner.name} uri={learner.avatarUrl} size={38} />
            <View style={styles.learnerInfo}>
              <AppText variant="bodySmall" weight="700" numberOfLines={1}>
                {learner.name}
              </AppText>
              <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                {learner.goal}
              </AppText>
            </View>
            <AppText variant="caption" color={Palette.success} weight="600" numberOfLines={1}>
              {learner.availability}
            </AppText>
          </View>
        ))}
      </Card>
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
  learnersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  card: {
    borderRadius: Radius.xl,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
  },
  learnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  teacherInfo: {
    flex: 1,
    gap: 1,
  },
  learnerInfo: {
    flex: 1,
    gap: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  teacherAction: {
    alignItems: 'flex-end',
    gap: 5,
  },
  matchPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Palette.successSoft,
  },
});
