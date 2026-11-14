import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Share, StyleSheet, View } from 'react-native';

import { ImpactHeader } from '@/components/impact/impact-header';
import { ImpactHeroCard } from '@/components/impact/impact-hero-card';
import { ImpactSwapSummary } from '@/components/impact/impact-swap-summary';
import { ReviewForm } from '@/components/impact/review-form';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { reviewTags } from '@/constants/content';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { impactService } from '@/services/impact.service';
import { swapsService } from '@/services/swaps.service';
import type { ImpactSummary, SkillIcon } from '@/types';
import type { SwapDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';

type ImpactScreenProps = {
  swapId?: string;
};

type SwapSummary = {
  partner: { name: string; avatarUrl: string; role: string };
  agreement: {
    yourSkill: string;
    yourSkillIcon: SkillIcon;
    partnerSkill: string;
    partnerSkillIcon: SkillIcon;
  };
};

function formatMoney(amount: number, currency: string): string {
  if (currency.toUpperCase() === 'USD') {
    return `$${Math.round(amount).toLocaleString()}`;
  }
  return `${Math.round(amount).toLocaleString()} ${currency}`;
}

function buildSummary(stats: Awaited<ReturnType<typeof impactService.getStats>>): ImpactSummary {
  return {
    eyebrow: 'Community impact',
    title: 'Small swaps. Real momentum.',
    description:
      'Every completed exchange adds another skill, another connection, and another story to the SkillBridge learning economy.',
    metrics: [
      {
        id: 'hours',
        label: 'Hours learned',
        value: stats.hoursExchanged.toLocaleString(),
        caption: 'shared across the community',
      },
      {
        id: 'swaps',
        label: 'Skill swaps',
        value: stats.completedSwaps.toLocaleString(),
        caption: 'completed so far',
      },
      {
        id: 'active',
        label: 'Active swaps',
        value: stats.activeSwaps.toLocaleString(),
        caption: 'currently in progress',
      },
      {
        id: 'saved',
        label: 'Estimated value',
        value: formatMoney(stats.estimatedMoneySaved, stats.currency),
        caption: 'saved by learners',
      },
    ],
  };
}

function buildSwapSummary(swap: SwapDto, userId?: string): SwapSummary {
  const isProposer = swap.proposer.id === userId;
  const partner = isProposer ? swap.receiver : swap.proposer;
  const yourSkill = isProposer ? swap.proposerTeaches : swap.receiverTeaches;
  const partnerSkill = isProposer ? swap.receiverTeaches : swap.proposerTeaches;

  return {
    partner: {
      name: partner.name,
      avatarUrl: partner.avatarUrl ?? '',
      role: partner.location || partner.timeZone || 'Exchange partner',
    },
    agreement: {
      yourSkill: yourSkill.name,
      yourSkillIcon: iconForSkill(yourSkill.name, yourSkill.category),
      partnerSkill: partnerSkill.name,
      partnerSkillIcon: iconForSkill(partnerSkill.name, partnerSkill.category),
    },
  };
}

export function ImpactScreen({ swapId }: ImpactScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [swap, setSwap] = useState<SwapSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [stats, swapDto] = await Promise.all([
        impactService.getStats(),
        swapId ? swapsService.get(swapId).catch(() => null) : Promise.resolve(null),
      ]);
      setSummary(buildSummary(stats));
      setSwap(swapDto ? buildSwapSummary(swapDto, user?.id) : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load community impact.');
    } finally {
      setLoading(false);
    }
  }, [swapId, user?.id]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/matches');
  };

  const shareImpact = async () => {
    if (!summary) return;
    const hours = summary.metrics.find((metric) => metric.id === 'hours')?.value ?? '0';
    try {
      await Share.share({
        message: `SkillBridge learners have exchanged ${hours} hours of skills. Join us and swap what you know.`,
      });
    } catch {
      Alert.alert('Share your impact', 'Invite a friend to start their first skill swap.');
    }
  };

  const submitReview = async (rating: number, comment?: string) => {
    if (!swapId) return;
    await swapsService.submitReview(swapId, rating, comment);
    Alert.alert('Review shared', 'Thanks for helping the community learn with confidence.');
  };

  return (
    <View style={styles.screen}>
      <ImpactHeader onBack={goBack} onShare={shareImpact} />

      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator color={Palette.primary} />
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Measuring community impact...
          </AppText>
        </View>
      ) : error || !summary ? (
        <View style={styles.state}>
          <Card style={styles.stateCard}>
            <AppText variant="subtitle" weight="700">
              Impact unavailable
            </AppText>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {error ?? 'Please try again.'}
            </AppText>
            <Button label="Try again" size="sm" onPress={load} />
          </Card>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <ImpactHeroCard summary={summary} />
          {swap ? (
            <>
              <ImpactSwapSummary partner={swap.partner} agreement={swap.agreement} />
              {swapId ? (
                <ReviewForm
                  partnerName={swap.partner.name}
                  tags={reviewTags}
                  onSubmit={submitReview}
                />
              ) : null}
            </>
          ) : (
            <Card style={styles.stateCard}>
              <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                Complete a swap to share a review and see your exchange summary here.
              </AppText>
            </Card>
          )}
        </ScrollView>
      )}
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
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
});
