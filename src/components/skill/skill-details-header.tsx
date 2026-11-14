import { ArrowLeft, Bookmark, Share2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';

type SkillDetailsHeaderProps = {
  onBack: () => void;
  onShare: () => void;
  onSave: () => void;
  saved: boolean;
};

export function SkillDetailsHeader({
  onBack,
  onShare,
  onSave,
  saved,
}: SkillDetailsHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back to skills"
            size={36}
            onPress={onBack}
          />
          <View style={styles.titleGroup}>
            <AppText variant="title" weight="700">
              Skill Details
            </AppText>
            <AppText variant="caption" color={Palette.textMuted}>
              Explore the exchange
            </AppText>
          </View>
        </View>

        <View style={styles.actions}>
          <IconButton
            icon={Share2}
            accessibilityLabel="Share this skill"
            size={36}
            onPress={onShare}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove saved skill' : 'Save this skill'}
            accessibilityState={{ selected: saved }}
            onPress={onSave}
            style={({ pressed }) => [
              styles.saveButton,
              saved && styles.saveButtonActive,
              pressed && styles.pressed,
            ]}>
            <Bookmark
              color={saved ? Palette.primary : Palette.text}
              fill={saved ? Palette.primary : 'none'}
              size={19}
              strokeWidth={2.2}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + Spacing.one,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
  },
  titleGroup: {
    flex: 1,
    gap: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surfaceMuted,
  },
  saveButtonActive: {
    backgroundColor: Palette.lavender,
  },
  pressed: {
    opacity: 0.7,
  },
});
