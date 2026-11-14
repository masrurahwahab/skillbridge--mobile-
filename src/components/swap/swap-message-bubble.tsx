import { CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Palette, Radius } from '@/constants/theme';
import type { SwapMessage } from '@/types';

import { SwapSessionCard } from './swap-session-card';

type SwapMessageBubbleProps = {
  message: SwapMessage;
  partnerName: string;
  partnerAvatarUrl: string;
  onJoinSession: () => void;
};

export function SwapMessageBubble({
  message,
  partnerName,
  partnerAvatarUrl,
  onJoinSession,
}: SwapMessageBubbleProps) {
  if (message.session) {
    return (
      <View style={styles.sessionWrap}>
        <SwapSessionCard session={message.session} onJoin={onJoinSession} />
      </View>
    );
  }

  if (message.sender === 'system') {
    return (
      <View style={styles.systemRow}>
        <CheckCircle2 color={Palette.success} size={13} strokeWidth={2.4} />
        <AppText variant="caption" color={Palette.textMuted} weight="600">
          {message.text}
        </AppText>
      </View>
    );
  }

  const isMine = message.sender === 'me';

  if (isMine) {
    return (
      <View style={styles.mineRow}>
        <View style={styles.mineBubble}>
          <AppText variant="body" color={Palette.white}>
            {message.text}
          </AppText>
        </View>
        {message.timeLabel ? (
          <AppText variant="caption" color={Palette.textMuted} align="right">
            {message.timeLabel} · Read
          </AppText>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.partnerRow}>
      <Avatar name={partnerName} uri={partnerAvatarUrl} size={28} />
      <View style={styles.partnerContent}>
        <View style={styles.partnerBubble}>
          <AppText variant="body">{message.text}</AppText>
        </View>
        {message.timeLabel ? (
          <AppText variant="caption" color={Palette.textMuted}>
            {message.timeLabel}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionWrap: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Palette.successSoft,
    maxWidth: '92%',
  },
  mineRow: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    maxWidth: '82%',
    gap: 3,
  },
  mineBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderBottomRightRadius: Radius.sm,
    backgroundColor: Palette.primary,
  },
  partnerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 7,
    maxWidth: '88%',
  },
  partnerContent: {
    flexShrink: 1,
    gap: 3,
  },
  partnerBubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.sm,
    backgroundColor: Palette.surface,
    borderWidth: 1,
    borderColor: Palette.border,
  },
});
