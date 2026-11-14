import { Image } from 'expo-image';
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Repeat2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { CommunityPost } from '@/types';

type PostCardProps = {
  post: CommunityPost;
  onAction: (post: CommunityPost) => void;
  onLike?: (post: CommunityPost) => void;
};

export function PostCard({ post, onAction, onLike }: PostCardProps) {
  const [liked, setLiked] = useState(Boolean(post.isLiked));
  const [saved, setSaved] = useState(false);

  return (
    <Card padded={false} style={styles.card}>
      <View style={styles.header}>
        <Avatar name={post.author.name} uri={post.author.avatarUrl} size={40} />
        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <AppText variant="subtitle" weight="700">
              {post.author.name}
            </AppText>
            <View style={styles.roleBadge}>
              <AppText variant="caption" color={Palette.textMuted} weight="600">
                {post.author.role}
              </AppText>
            </View>
          </View>
          <AppText variant="caption" color={Palette.textMuted} numberOfLines={1}>
            {post.author.handle} · {post.timeAgo} · in{' '}
            <AppText variant="caption" color={Palette.primary} weight="600">
              {post.category}
            </AppText>
          </AppText>
        </View>
        <IconButton
          icon={MoreHorizontal}
          accessibilityLabel="Post options"
          variant="plain"
          size={32}
          onPress={() => Alert.alert('Post options', 'Post actions will appear here.')}
        />
      </View>

      <AppText variant="body" style={styles.content}>
        {post.content}
      </AppText>

      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      ) : null}

      <View style={styles.actions}>
        <View style={styles.actionGroup}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={liked ? 'Unlike post' : 'Like post'}
            accessibilityState={{ selected: liked }}
            hitSlop={6}
            onPress={() => {
              setLiked((current) => !current);
              onLike?.(post);
            }}
            style={styles.actionButton}>
            <Heart
              color={liked ? Palette.danger : Palette.textMuted}
              fill={liked ? Palette.danger : 'none'}
              size={18}
              strokeWidth={2}
            />
            <AppText
              variant="caption"
              color={liked ? Palette.danger : Palette.textMuted}
              weight="600">
              {post.likes + (liked ? 1 : 0)}
            </AppText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View comments"
            hitSlop={6}
            onPress={() =>
              Alert.alert('Comments', 'Comment threads are coming with the Community screen.')
            }
            style={styles.actionButton}>
            <MessageCircle color={Palette.textMuted} size={18} strokeWidth={2} />
            <AppText variant="caption" color={Palette.textMuted} weight="600">
              {post.comments}
            </AppText>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={post.actionLabel}
            hitSlop={6}
            onPress={() => onAction(post)}
            style={[styles.actionButton, styles.exchangeButton]}>
            <Repeat2 color={Palette.accent} size={18} strokeWidth={2} />
            <AppText
              variant="caption"
              color={Palette.accent}
              weight="600"
              numberOfLines={1}
              style={styles.exchangeLabel}>
              {post.actionLabel}
            </AppText>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={saved ? 'Remove bookmark' : 'Save post'}
          accessibilityState={{ selected: saved }}
          hitSlop={6}
          onPress={() => setSaved((current) => !current)}>
          <Bookmark
            color={saved ? Palette.primary : Palette.textMuted}
            fill={saved ? Palette.primary : 'none'}
            size={18}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: Palette.surfaceMuted,
  },
  content: {
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 176,
    marginTop: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    flex: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exchangeButton: {
    flexShrink: 1,
  },
  exchangeLabel: {
    flexShrink: 1,
  },
});

