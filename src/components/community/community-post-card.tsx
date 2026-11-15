import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Heart, MessageCircle, Bookmark, ArrowUpRight } from 'lucide-react-native';

import type { CommunityPostExtended, PostCategory } from '@/types';
import { Palette, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import { Avatar } from '@/components/ui/avatar';

interface CommunityPostCardProps {
  post: CommunityPostExtended;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
  onComment?: (id: string) => void;
  onAction?: (post: CommunityPostExtended) => void;
}

const CATEGORY_COLORS: Record<
  PostCategory,
  { bg: string; text: string; label: string }
> = {
  all: { bg: Palette.surfaceMuted, text: Palette.textMuted, label: 'Post' },
  project: { bg: '#EEF2FF', text: '#3730A3', label: 'Project' },
  question: { bg: '#EFF6FF', text: '#2563EB', label: 'Question' },
  tutorial: { bg: '#ECFDF5', text: '#059669', label: 'Tutorial' },
  opportunity: { bg: '#FDF4FF', text: '#86198F', label: 'Opportunity' },
  discussion: { bg: '#F1F5F9', text: '#475569', label: 'Discussion' },
};

export function CommunityPostCard({
  post,
  onLike,
  onSave,
  onComment,
  onAction,
}: CommunityPostCardProps) {
  const catStyle =
    CATEGORY_COLORS[post.postCategory] ?? CATEGORY_COLORS.discussion;

  return (
    <View style={styles.card}>
      {/* Top author row */}
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Avatar
            name={post.author.name}
            uri={post.author.avatarUrl}
            size={40}
            ringColor={Palette.border}
          />
          <View style={styles.authorMeta}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <Text style={styles.timeAgo}>· {post.timeAgo}</Text>
            </View>
            <Text style={styles.skillExchange}>
              {post.skillExchange || post.category}
            </Text>
          </View>
        </View>

        <View style={[styles.categoryBadge, { backgroundColor: catStyle.bg }]}>
          <Text style={[styles.categoryBadgeText, { color: catStyle.text }]}>
            {catStyle.label}
          </Text>
        </View>
      </View>

      {/* Post body */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Optional image */}
      {post.imageUrl ? (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          contentFit="cover"
        />
      ) : null}

      {/* Bottom actions */}
      <View style={styles.footer}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => onLike?.(post.id)}
          >
            <Heart
              size={18}
              color={post.isLiked ? Palette.danger : Palette.textMuted}
              fill={post.isLiked ? Palette.danger : 'none'}
            />
            <Text
              style={[
                styles.actionCount,
                post.isLiked && { color: Palette.danger },
              ]}
            >
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.7}
            onPress={() => onComment?.(post.id)}
          >
            <MessageCircle size={18} color={Palette.textMuted} />
            <Text style={styles.actionCount}>{post.comments}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightActions}>
          {post.actionLabel ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onAction?.(post)}
              style={styles.actionLinkBtn}
            >
              <Text style={styles.actionLinkText}>{post.actionLabel}</Text>
              <ArrowUpRight size={14} color={Palette.accent} />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.bookmarkBtn}
            activeOpacity={0.7}
            onPress={() => onSave?.(post.id)}
          >
            <Bookmark
              size={18}
              color={post.saved ? Palette.primary : Palette.textMuted}
              fill={post.saved ? Palette.primary : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.surface,
    borderRadius: Radius.lg,
    padding: Spacing.three,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: Palette.border,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flex: 1,
  },
  authorMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  authorName: {
    ...(Typography.title as object),
    fontSize: 15,
    color: Palette.text,
  },
  timeAgo: {
    ...(Typography.caption as object),
    color: Palette.textMuted,
  },
  skillExchange: {
    ...(Typography.caption as object),
    color: Palette.textMuted,
    marginTop: 1,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  categoryBadgeText: {
    ...(Typography.caption as object),
    fontWeight: '600',
    fontSize: 11,
  },
  content: {
    ...(Typography.body as object),
    color: Palette.text,
    lineHeight: 21,
    marginBottom: Spacing.two,
  },
  postImage: {
    width: '100%',
    height: 180,
    borderRadius: Radius.md,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderColor: Palette.border,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    ...(Typography.caption as object),
    fontWeight: '600',
    color: Palette.textMuted,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  actionLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    backgroundColor: '#EFF6FF',
  },
  actionLinkText: {
    ...(Typography.caption as object),
    color: Palette.accent,
    fontWeight: '600',
  },
  bookmarkBtn: {
    padding: 2,
  },
});
