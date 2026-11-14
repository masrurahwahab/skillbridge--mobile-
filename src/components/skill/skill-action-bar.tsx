import { Repeat2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Palette, Spacing } from '@/constants/theme';

type SkillActionBarProps = {
  teacherCount: number;
  onFindPartner: () => void;
};

export function SkillActionBar({ teacherCount, onFindPartner }: SkillActionBarProps) {
  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <AppText variant="caption" color={Palette.textMuted}>
          {teacherCount} teachers ready to exchange
        </AppText>
        <Button
          label="Find a Learning Partner"
          icon={Repeat2}
          fullWidth
          onPress={onFindPartner}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  container: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: 6,
  },
});
