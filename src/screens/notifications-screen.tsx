import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { NotificationCard } from '@/components/notifications/notification-card';
import { NotificationFilters } from '@/components/notifications/notification-filters';
import { NotificationsHeader } from '@/components/notifications/notifications-header';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { notificationsService } from '@/services/notifications.service';
import type { AppNotification, NotificationFilterKey, NotificationKind } from '@/types';
import type { NotificationDto } from '@/types/api';
import { formatRelativeTime } from '@/utils/time';

function toNotification(dto: NotificationDto): AppNotification {
  const isCommunity = dto.type === 'ReviewReceived';
  let kind: NotificationKind = 'swap';
  if (isCommunity) kind = 'endorsement';
  if (dto.type === 'NewMessage' || dto.type.startsWith('Session')) kind = 'session';

  return {
    id: String(dto.id),
    kind,
    category: isCommunity ? 'community' : 'swaps',
    title: 'SkillBridge',
    timeAgo: formatRelativeTime(dto.createdAt),
    bodyPrefix: dto.text,
    unread: !dto.isRead,
    avatarName: 'SkillBridge',
    initials: 'SB',
    swapId: dto.swapId,
  };
}

export function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<NotificationFilterKey>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    setError(null);
    try {
      const remote = await notificationsService.list();
      setItems(remote.map(toNotification));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load notifications.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const unreadCount = items.filter((item) => item.unread).length;
  const swapCount = items.filter((item) => item.category === 'swaps').length;
  const visibleItems =
    filter === 'all' ? items : items.filter((item) => item.category === filter);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  const markAllRead = async () => {
    const unread = items.filter((item) => item.unread);
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    await Promise.all(
      unread.map((item) =>
        notificationsService.markRead(Number(item.id)).catch(() => undefined)
      )
    );
  };

  const markRead = async (id: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
    const numId = Number(id);
    if (!Number.isNaN(numId)) {
      try {
        await notificationsService.markRead(numId);
      } catch {
        // The next refresh reconciles state.
      }
    }
  };

  const handleAction = (
    notification: AppNotification,
    action: 'primary' | 'secondary'
  ) => {
    void markRead(notification.id);

    if (notification.kind === 'swap' || notification.kind === 'session') {
      if (notification.swapId) {
        router.push({ pathname: '/swap/[id]', params: { id: notification.swapId } });
        return;
      }
      Alert.alert('Swap update', notification.bodyPrefix);
      return;
    }

    if (notification.kind === 'endorsement' && notification.swapId) {
      router.push({ pathname: '/impact', params: { swapId: notification.swapId } });
      return;
    }

    router.push(action === 'primary' ? '/community' : '/');
  };

  return (
    <View style={styles.screen}>
      <NotificationsHeader
        unreadCount={unreadCount}
        onBack={goBack}
        onMarkAllRead={markAllRead}
      />

      <NotificationFilters
        value={filter}
        swapCount={swapCount}
        unreadCount={unreadCount}
        onChange={setFilter}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Palette.primary]}
            tintColor={Palette.primary}
          />
        }>
        {loading ? (
          <View style={styles.state}>
            <ActivityIndicator color={Palette.primary} />
            <AppText variant="bodySmall" color={Palette.textMuted}>
              Loading notifications...
            </AppText>
          </View>
        ) : error ? (
          <Card style={styles.emptyCard}>
            <AppText variant="subtitle" weight="700" align="center">
              Notifications unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error}
            </AppText>
            <Button label="Try again" size="sm" onPress={loadNotifications} />
          </Card>
        ) : (
          <>
            <View style={styles.list}>
              {visibleItems.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAction={handleAction}
                />
              ))}
            </View>

            {visibleItems.length === 0 ? (
              <Card style={styles.emptyCard}>
                <AppText variant="subtitle" weight="700" align="center">
                  No notifications here
                </AppText>
                <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                  New swap invites, sessions, and community activity will appear in this tab.
                </AppText>
              </Card>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.five,
    flexGrow: 1,
  },
  list: {
    overflow: 'hidden',
    backgroundColor: Palette.surface,
    borderRadius: 0,
  },
  state: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  emptyCard: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    alignItems: 'center',
    gap: 5,
  },
});
