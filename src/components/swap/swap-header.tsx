import { ArrowLeft, MoreHorizontal } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';

type SwapHeaderProps = {
  name: string;
  avatarUrl: string;
  activity: string;
  onBack: () => void;
  onMore: () => void;
};

export function SwapHeader({
  name,
  avatarUrl,
  activity,
  onBack,
  onMore,
}: SwapHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <IconButton
          icon={ArrowLeft}
          accessibilityLabel="Back to matches"
          size={36}
          onPress={onBack}
        />

        <View style={styles.identity}>
          <Avatar name={name} uri={avatarUrl} size={38} ringColor={Palette.successRing} />
          <View style={styles.identityText}>
            <AppText variant="body" weight="700" numberOfLines={1}>
              {name}
            </AppText>
            <View style={styles.activityRow}>
              <View style={styles.onlineDot} />
              <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
                {activity}
              </AppText>
            </View>
          </View>
        </View>

        <IconButton
          icon={MoreHorizontal}
          accessibilityLabel="Swap options"
          size={36}
          onPress={onMore}
        />
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
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two + Spacing.one,
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.background,
  },
  identityText: {
    flex: 1,
    gap: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
});
