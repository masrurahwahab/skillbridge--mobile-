import { ArrowLeft } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';

type NotificationsHeaderProps = {
  unreadCount: number;
  onBack: () => void;
  onMarkAllRead: () => void;
};

export function NotificationsHeader({
  unreadCount,
  onBack,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  const canMarkRead = unreadCount > 0;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <IconButton
            icon={ArrowLeft}
            accessibilityLabel="Back to Home"
            size={36}
            onPress={onBack}
          />
          <View style={styles.titleGroup}>
            <AppText variant="title" weight="700">
              Notifications
            </AppText>
            <AppText variant="caption" color={Palette.textMuted}>
              Activity & Session Invites
            </AppText>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mark all notifications as read"
          accessibilityState={{ disabled: !canMarkRead }}
          disabled={!canMarkRead}
          onPress={onMarkAllRead}
          hitSlop={6}
          style={({ pressed }) => [
            styles.markRead,
            !canMarkRead && styles.markReadDisabled,
            pressed && canMarkRead && styles.pressed,
          ]}>
          <AppText
            variant="caption"
            color={canMarkRead ? Palette.accent : Palette.textMuted}
            weight="700">
            {canMarkRead ? `Mark all read (${unreadCount})` : 'All caught up'}
          </AppText>
        </Pressable>
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
  markRead: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.accentSubtle,
  },
  markReadDisabled: {
    backgroundColor: Palette.surfaceMuted,
  },
  pressed: {
    opacity: 0.75,
  },
});
