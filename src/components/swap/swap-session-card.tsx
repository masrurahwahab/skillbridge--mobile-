import { CalendarDays, Clock3, Video } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Palette, Radius, Shadows } from '@/constants/theme';
import type { SwapSession } from '@/types';

type SwapSessionCardProps = {
  session: SwapSession;
  onJoin: () => void;
};

export function SwapSessionCard({ session, onJoin }: SwapSessionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconTile}>
        <Video color={Palette.white} size={20} strokeWidth={2.2} />
      </View>

      <View style={styles.info}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <AppText variant="caption" color={Palette.successText} weight="700">
            {session.status === 'scheduled' ? 'SESSION SCHEDULED' : 'SESSION COMPLETED'}
          </AppText>
        </View>
        <AppText variant="body" weight="700" numberOfLines={2}>
          {session.title}
        </AppText>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <CalendarDays color={Palette.textMuted} size={13} strokeWidth={2} />
            <AppText variant="caption" color={Palette.textMuted} weight="600">
              {session.dateLabel}
            </AppText>
          </View>
          <View style={styles.metaItem}>
            <Clock3 color={Palette.textMuted} size={13} strokeWidth={2} />
            <AppText variant="caption" color={Palette.textMuted} weight="600">
              {session.timeLabel} · {session.durationLabel}
            </AppText>
          </View>
        </View>
        <AppText variant="caption" color={Palette.textMuted}>
          {session.formatLabel}
        </AppText>
      </View>

      <Button
        label="Join"
        size="sm"
        variant="secondary"
        onPress={onJoin}
        accessibilityLabel={`Join ${session.title}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: Radius.xl,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.accentBorder,
    ...Shadows.card,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.primary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.success,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    rowGap: 2,
    marginTop: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
