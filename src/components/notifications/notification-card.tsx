import {
  ArrowRight,
  CalendarDays,
  Heart,
  Repeat2,
  Star,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { AppNotification, NotificationKind } from '@/types';

type NotificationCardProps = {
  notification: AppNotification;
  onAction: (
    notification: AppNotification,
    action: 'primary' | 'secondary',
  ) => void;
};

type NotificationMeta = {
  icon: LucideIcon;
  color: string;
  softColor: string;
};

const NOTIFICATION_META: Record<NotificationKind, NotificationMeta> = {
  swap: { icon: Repeat2, color: Palette.accent, softColor: Palette.accentSubtle },
  session: { icon: CalendarDays, color: Palette.warning, softColor: Palette.warningSoft },
  endorsement: { icon: Star, color: Palette.success, softColor: Palette.successSoft },
  community: { icon: Heart, color: Palette.danger, softColor: Palette.dangerSoft },
};

export function NotificationCard({ notification, onAction }: NotificationCardProps) {
  const meta = NOTIFICATION_META[notification.kind];
  const BadgeIcon = meta.icon;
  const isSwap = notification.kind === 'swap';
  const isSession = notification.kind === 'session';
  const isLink = notification.kind === 'endorsement' || notification.kind === 'community';

  return (
    <View
      style={[
        styles.card,
        notification.unread && isSwap && styles.swapUnread,
        notification.unread && isSession && styles.sessionUnread,
      ]}>
      <View style={styles.avatarWrap}>
        {notification.avatarUrl ? (
          <Avatar
            name={notification.avatarName}
            uri={notification.avatarUrl}
            size={44}
            ringColor={meta.softColor}
          />
        ) : (
          <View style={[styles.initialsAvatar, { backgroundColor: meta.softColor }]}>
            <AppText variant="label" color={meta.color} weight="700">
              {notification.initials}
            </AppText>
          </View>
        )}
        <View style={[styles.kindBadge, { backgroundColor: meta.color }]}>
          <BadgeIcon color={Palette.white} size={10} strokeWidth={2.6} />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <AppText variant="subtitle" weight="700" numberOfLines={1} style={styles.title}>
            {notification.title}
          </AppText>
          <View style={styles.timeRow}>
            <AppText
              variant="caption"
              color={
                notification.unread && isSwap ? Palette.accent : Palette.textMuted
              }
              weight={notification.unread && isSwap ? '700' : '500'}>
              {notification.timeAgo}
            </AppText>
            {notification.unread ? (
              <View style={[styles.unreadDot, { backgroundColor: meta.color }]} />
            ) : null}
          </View>
        </View>

        <AppText variant="bodySmall" style={styles.body}>
          {notification.bodyPrefix}
          {notification.highlight ? (
            <AppText variant="bodySmall" weight="700">
              {notification.highlight}
            </AppText>
          ) : null}
          {notification.bodySuffix}
        </AppText>

        {isSwap || isSession ? (
          <View style={styles.actions}>
            <NotificationAction
              label={isSwap ? 'Open Workspace' : 'View Session'}
              variant={isSwap ? 'primary' : 'warning'}
              onPress={() => onAction(notification, 'primary')}
            />
            {isSwap ? (
              <NotificationAction
                label="View Schedule"
                variant="ghost"
                onPress={() => onAction(notification, 'secondary')}
              />
            ) : null}
          </View>
        ) : null}

        {isLink ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              notification.kind === 'endorsement' ? 'Read endorsement' : 'View in feed'
            }
            onPress={() => onAction(notification, 'primary')}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
            <AppText variant="caption" color={Palette.accent} weight="700">
              {notification.kind === 'endorsement' ? 'Read endorsement' : 'View in feed'}
            </AppText>
            <ArrowRight color={Palette.accent} size={13} strokeWidth={2.4} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

type NotificationActionProps = {
  label: string;
  variant: 'primary' | 'warning' | 'ghost';
  onPress: () => void;
};

function NotificationAction({ label, variant, onPress }: NotificationActionProps) {
  const isGhost = variant === 'ghost';
  const textColor = isGhost ? Palette.text : Palette.white;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        variant === 'primary' && styles.primaryAction,
        variant === 'warning' && styles.warningAction,
        isGhost && styles.ghostAction,
        pressed && styles.pressed,
      ]}>
      <AppText variant="caption" color={textColor} weight="700">
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  swapUnread: {
    backgroundColor: Palette.accentSubtle,
  },
  sessionUnread: {
    backgroundColor: Palette.warningSoft,
  },
  avatarWrap: {
    position: 'relative',
  },
  initialsAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Palette.surface,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
  },
  body: {
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  primaryAction: {
    backgroundColor: Palette.primary,
  },
  warningAction: {
    backgroundColor: Palette.warning,
  },
  ghostAction: {
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 3,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.8,
  },
});
