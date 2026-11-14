import { BookOpen, Compass, Repeat2, type LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius } from '@/constants/theme';

type MatchSkillExchangeProps = {
  teaches: string;
  wants: string;
};

export function MatchSkillExchange({ teaches, wants }: MatchSkillExchangeProps) {
  return (
    <View style={styles.container}>
      <SkillRow
        label="Teaches (What you want)"
        skill={teaches}
        icon={BookOpen}
        tone="teach"
      />

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <View style={styles.tradePill}>
          <Repeat2 color={Palette.accent} size={13} strokeWidth={2.2} />
          <AppText variant="caption" color={Palette.accent} weight="600">
            Direct Trade
          </AppText>
        </View>
        <View style={styles.line} />
      </View>

      <SkillRow label="Wants (What you teach)" skill={wants} icon={Compass} tone="learn" />
    </View>
  );
}

type SkillRowProps = {
  label: string;
  skill: string;
  icon: LucideIcon;
  tone: 'teach' | 'learn';
};

function SkillRow({ label, skill, icon: Icon, tone }: SkillRowProps) {
  const isTeach = tone === 'teach';

  return (
    <View style={styles.skillRow}>
      <View style={[styles.iconWrap, isTeach ? styles.teachIcon : styles.learnIcon]}>
        <Icon
          color={isTeach ? Palette.teachText : Palette.learnText}
          size={12}
          strokeWidth={2.2}
        />
      </View>
      <View style={styles.skillCopy}>
        <AppText
          variant="overline"
          color={isTeach ? Palette.teachText : Palette.learnText}
          weight="700">
          {label}
        </AppText>
        <AppText variant="bodySmall" weight="600">
          {skill}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  iconWrap: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  teachIcon: {
    backgroundColor: Palette.teachBg,
  },
  learnIcon: {
    backgroundColor: Palette.learnBg,
  },
  skillCopy: {
    flex: 1,
    gap: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 1,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  tradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Palette.accentSubtle,
  },
});
