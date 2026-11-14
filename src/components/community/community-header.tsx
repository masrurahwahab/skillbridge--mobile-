import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bell, Globe } from 'lucide-react-native';

import { Palette, Typography, Radius, Spacing, Shadows } from '@/constants/theme';

interface CommunityHeaderProps {
  onPost: () => void;
  hasUnread: boolean;
}

export function CommunityHeader({ onPost, hasUnread }: CommunityHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Globe size={20} color={Palette.primary} strokeWidth={2} />
        </View>
        <Text style={styles.title}>Community</Text>
      </View>
      <View style={styles.actions}>
        <View style={styles.bellWrap}>
          <Bell size={22} color={Palette.textMuted} strokeWidth={2} />
          {hasUnread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.postBtn} onPress={onPost}>
          + Post
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    backgroundColor: Palette.surface,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
    ...Shadows.card,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Palette.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...(Typography.title as object),
    color: Palette.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  bellWrap: {
    position: 'relative',
    padding: Spacing.one,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Palette.danger,
    borderWidth: 1.5,
    borderColor: Palette.surface,
  },
  postBtn: {
    ...(Typography.label as object),
    color: Palette.surface,
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
});
