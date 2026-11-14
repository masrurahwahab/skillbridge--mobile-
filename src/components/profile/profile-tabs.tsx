import { Repeat2, Star, type LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import type { ProfileTabKey, UserProfile } from '@/types';

import { PinnedPostCard } from './pinned-post-card';

type ProfileTabsProps = {
  profile: UserProfile;
  onViewPost: () => void;
};

export function ProfileTabs({ profile, onViewPost }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<ProfileTabKey>('posts');
  const rating = profile.stats.find((stat) => stat.id === 'rating')?.value ?? '0.0';

  const tabs: { key: ProfileTabKey; label: string }[] = [
    { key: 'posts', label: `Posts (${profile.postCount})` },
    { key: 'exchanges', label: `Exchanges (${profile.exchangeCount})` },
    { key: 'reviews', label: 'Reviews' },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, active && styles.activeTab]}>
              <AppText
                variant="subtitle"
                color={active ? Palette.primary : Palette.textMuted}
                weight={active ? '700' : '500'}>
                {tab.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'posts' ? (
        <View style={styles.content}>
          {profile.posts.map((post) => (
            <PinnedPostCard key={post.id} post={post} onView={onViewPost} />
          ))}
        </View>
      ) : null}

      {activeTab === 'exchanges' ? (
        <EmptyTabCard
          icon={Repeat2}
          tone="success"
          title={`${profile.exchangeCount} exchanges completed`}
          body="Your active and completed skill trades will appear here."
        />
      ) : null}

      {activeTab === 'reviews' ? (
        <View style={styles.content}>
          {(profile.reviews ?? []).length > 0 ? (
            profile.reviews?.map((review) => (
              <Card key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Avatar
                    name={review.reviewerName}
                    uri={review.reviewerAvatarUrl}
                    size={32}
                  />
                  <View style={styles.reviewIdentity}>
                    <AppText variant="bodySmall" weight="700">
                      {review.reviewerName}
                    </AppText>
                    <AppText variant="caption" color={Palette.textMuted}>
                      {'★'.repeat(Math.round(review.rating))} · {review.timeAgo}
                    </AppText>
                  </View>
                </View>
                <AppText variant="bodySmall" color={Palette.text}>
                  {review.comment}
                </AppText>
              </Card>
            ))
          ) : (
            <EmptyTabCard
              icon={Star}
              tone="warning"
              title={`${rating} partner rating`}
              body="Reviews from exchange partners will appear here."
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

type EmptyTabCardProps = {
  icon: LucideIcon;
  tone: 'success' | 'warning';
  title: string;
  body: string;
};

function EmptyTabCard({ icon: Icon, tone, title, body }: EmptyTabCardProps) {
  const color = tone === 'success' ? Palette.success : Palette.warning;

  return (
    <Card style={styles.emptyCard}>
      <View style={[styles.emptyIcon, { backgroundColor: tone === 'success' ? Palette.successSoft : Palette.warningSoft }]}>
        <Icon color={color} size={20} strokeWidth={2.2} />
      </View>
      <AppText variant="subtitle" weight="700">
        {title}
      </AppText>
      <AppText variant="bodySmall" color={Palette.textMuted} align="center">
        {body}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.three,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  tab: {
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Palette.transparent,
    marginBottom: -1,
  },
  activeTab: {
    borderBottomColor: Palette.primary,
  },
  content: {
    gap: Spacing.two,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 6,
    padding: Spacing.three,
    borderRadius: Radius.lg,
  },
  reviewCard: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  reviewIdentity: {
    flex: 1,
    gap: 1,
  },
  emptyIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
