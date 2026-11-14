import { UsersRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Palette, Radius, Spacing } from '@/constants/theme';

type MatchPreviewProps = {
  count?: number;
};

export function MatchPreview({ count }: MatchPreviewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <UsersRound color={Palette.success} size={20} strokeWidth={2.2} />
        <AppText variant="bodySmall" weight="600" color={Palette.successText} style={styles.copy}>
          {count != null
            ? `${count} potential peer matches found!`
            : 'Your personalized matches refresh as soon as you save.'}
        </AppText>
      </View>
      <AppText variant="overline" color={Palette.success} weight="700">
        High Synergy
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.successBorder,
    backgroundColor: Palette.successSoft,
  },
  left: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  copy: {
    flexShrink: 1,
  },
});
