import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Radius, Spacing } from '@/constants/theme';

import { AppText } from './app-text';

type PlaceholderScreenProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderScreen({ title, description, icon: Icon }: PlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <AppText variant="headline">{title}</AppText>
      </View>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Icon color={Palette.primary} size={30} strokeWidth={2} />
        </View>
        <AppText variant="title" align="center">
          Coming next
        </AppText>
        <AppText variant="body" color={Palette.textMuted} align="center">
          {description}
        </AppText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  header: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.lavender,
    marginBottom: Spacing.one,
  },
});
