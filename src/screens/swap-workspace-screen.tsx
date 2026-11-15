import { useRouter } from 'expo-router';
import { CheckCircle2, Star } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SwapAgreementCard } from '@/components/swap/swap-agreement-card';
import { SwapComposer } from '@/components/swap/swap-composer';
import { SwapHeader } from '@/components/swap/swap-header';
import { SwapMessageBubble } from '@/components/swap/swap-message-bubble';
import { SwapProposalForm } from '@/components/swap/swap-proposal-form';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { chatService } from '@/services/chat.service';
import { skillsService } from '@/services/skills.service';
import { swapsService } from '@/services/swaps.service';
import { usersService } from '@/services/users.service';
import type { SkillOption, SwapMessage } from '@/types';
import type { MessageDto, PublicProfileDto, SessionDto, SwapDto } from '@/types/api';
import { iconForSkill } from '@/utils/skills';
import { formatTime } from '@/utils/time';

type SwapWorkspaceScreenProps = {
  swapId?: string;
};

type Workspace = {
  swap: SwapDto;
  partnerName: string;
  partnerAvatarUrl: string;
  partnerActivity: string;
  yourSkill: string;
  yourSkillIcon: ReturnType<typeof iconForSkill>;
  partnerSkill: string;
  partnerSkillIcon: ReturnType<typeof iconForSkill>;
};

type ProposalState = {
  profile: PublicProfileDto;
  mySkills: SkillOption[];
};

function toSwapMessage(message: MessageDto, userId?: string): SwapMessage {
  return {
    id: String(message.id),
    sender: message.senderId === userId ? 'me' : 'partner',
    text: message.text,
    timeLabel: formatTime(message.sentAt),
  };
}

function buildWorkspace(swap: SwapDto, userId?: string): Workspace {
  const isProposer = swap.proposer.id === userId;
  const partner = isProposer ? swap.receiver : swap.proposer;
  const yourSkill = isProposer ? swap.proposerTeaches : swap.receiverTeaches;
  const partnerSkill = isProposer ? swap.receiverTeaches : swap.proposerTeaches;

  return {
    swap,
    partnerName: partner.name,
    partnerAvatarUrl: partner.avatarUrl ?? '',
    partnerActivity: partner.location || partner.timeZone || 'SkillBridge member',
    yourSkill: yourSkill.name,
    yourSkillIcon: iconForSkill(yourSkill.name, yourSkill.category),
    partnerSkill: partnerSkill.name,
    partnerSkillIcon: iconForSkill(partnerSkill.name, partnerSkill.category),
  };
}

function statusLabel(swap: SwapDto, userId?: string): string {
  switch (swap.status) {
    case 'Proposed':
      return swap.receiver.id === userId ? 'New swap proposal' : 'Awaiting acceptance';
    case 'Active':
      return 'Swap in progress';
    case 'Completed':
      return 'Swap completed';
    case 'Declined':
      return 'Swap declined';
    default:
      return 'Swap cancelled';
  }
}

export function SwapWorkspaceScreen({ swapId }: SwapWorkspaceScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [proposal, setProposal] = useState<ProposalState | null>(null);
  const [messages, setMessages] = useState<SwapMessage[]>([]);
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [proposalMessage, setProposalMessage] = useState('');
  const [teachingId, setTeachingId] = useState<string>();
  const [learningId, setLearningId] = useState<string>();

  const load = useCallback(async () => {
    if (!swapId) {
      setError('This exchange could not be found.');
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const swap = await swapsService.get(swapId);
      const [remoteMessages, remoteSessions] = await Promise.all([
        swapsService.getMessages(swapId),
        swapsService.getSessions(swapId),
      ]);
      setWorkspace(buildWorkspace(swap, user?.id));
      setMessages(remoteMessages.map((message) => toSwapMessage(message, user?.id)));
      setSessions(remoteSessions);
      setProposal(null);
    } catch {
      try {
        const existingSwaps = await swapsService.list(undefined, 1, 50);
        const existing = existingSwaps.items.find(
          (item) =>
            (item.proposer.id === swapId || item.receiver.id === swapId) &&
            item.status !== 'Cancelled' &&
            item.status !== 'Declined'
        );
        if (existing) {
          const [remoteMessages, remoteSessions] = await Promise.all([
            swapsService.getMessages(existing.id),
            swapsService.getSessions(existing.id),
          ]);
          setWorkspace(buildWorkspace(existing, user?.id));
          setMessages(remoteMessages.map((message) => toSwapMessage(message, user?.id)));
          setSessions(remoteSessions);
          setProposal(null);
          return;
        }
      } catch {
        // Fall through to the proposal form.
      }

      try {
        const [profile, mySkills] = await Promise.all([
          usersService.getProfile(swapId),
          skillsService.mySkills(),
        ]);
        const options: SkillOption[] = mySkills.offering.map((userSkill) => ({
          id: String(userSkill.skill.id),
          label: userSkill.skill.name,
          icon: iconForSkill(userSkill.skill.name, userSkill.skill.category),
        }));
        setProposal({ profile, mySkills: options });
        setTeachingId(options[0]?.id);
        setLearningId(String(profile.offering[0]?.skill.id ?? ''));
        setWorkspace(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load this exchange.');
      }
    } finally {
      setLoading(false);
    }
  }, [swapId, user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!workspace || workspace.swap.status !== 'Active') return;

    let disposed = false;
    let unsubscribe = () => {};

    (async () => {
      try {
        await chatService.connect();
        if (disposed) return;
        unsubscribe = chatService.onMessage((message) => {
          if (message.swapId !== workspace.swap.id) return;
          setMessages((current) => {
            if (current.some((item) => item.id === String(message.id))) return current;
            return [...current, toSwapMessage(message, user?.id)];
          });
        });
        await chatService.joinSwap(workspace.swap.id);
      } catch {
        // REST remains available as a fallback.
      }
    })();

    return () => {
      disposed = true;
      unsubscribe();
      void chatService.leaveSwap(workspace.swap.id);
    };
  }, [workspace, user?.id]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/matches');
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || !workspace) return;
    setDraft('');

    try {
      await chatService.sendMessage(workspace.swap.id, text);
      setTimeout(async () => {
        try {
          const remote = await swapsService.getMessages(workspace.swap.id);
          setMessages(remote.map((message) => toSwapMessage(message, user?.id)));
        } catch {
          // The SignalR handler may still deliver the message.
        }
      }, 400);
    } catch {
      try {
        const sent = await swapsService.sendMessage(workspace.swap.id, text);
        setMessages((current) => [...current, toSwapMessage(sent, user?.id)]);
      } catch (err) {
        setDraft(text);
        Alert.alert(
          'Message not sent',
          err instanceof Error ? err.message : 'Please try again in a moment.'
        );
      }
    }
  };

  const openOptions = () => {
    if (!workspace) return;
    Alert.alert('Swap options', 'Manage this exchange.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Leave exchange',
        style: 'destructive',
        onPress: async () => {
          try {
            await swapsService.cancel(workspace.swap.id);
          } catch {
            // The exchange may already be closed.
          }
          router.replace('/matches');
        },
      },
    ]);
  };

  const joinSession = () => {
    const link = sessions.find((session) => session.meetingLink)?.meetingLink;
    if (link) {
      void Linking.openURL(link);
      return;
    }
    Alert.alert('Session link', 'Your partner has not added a meeting link yet.');
  };

  const respond = async (accept: boolean) => {
    if (!workspace) return;
    try {
      const updated = accept
        ? await swapsService.accept(workspace.swap.id)
        : await swapsService.decline(workspace.swap.id);
      setWorkspace(buildWorkspace(updated, user?.id));
      if (!accept) router.replace('/matches');
    } catch (err) {
      Alert.alert(
        'Could not update swap',
        err instanceof Error ? err.message : 'Please try again.'
      );
    }
  };

  const markFinished = async () => {
    if (!workspace) return;
    try {
      const updated = await swapsService.complete(workspace.swap.id);
      setWorkspace(buildWorkspace(updated, user?.id));
      router.push({ pathname: '/impact', params: { swapId: workspace.swap.id } });
    } catch (err) {
      Alert.alert(
        'Could not complete swap',
        err instanceof Error ? err.message : 'Please try again.'
      );
    }
  };

  const submitProposal = async () => {
    if (!swapId || !proposal || !teachingId || !learningId) return;
    setSubmitting(true);
    try {
      const created = await swapsService.propose(
        swapId,
        Number(teachingId),
        Number(learningId),
        1,
        proposalMessage.trim() || undefined
      );
      router.replace({ pathname: '/swap/[id]', params: { id: created.id } });
      setProposalMessage('');
    } catch (err) {
      Alert.alert(
        'Could not send proposal',
        err instanceof Error ? err.message : 'Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Palette.primary} />
        <AppText variant="bodySmall" color={Palette.textMuted}>
          Loading exchange...
        </AppText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Card style={styles.stateCard}>
          <AppText variant="subtitle" weight="700">
            Exchange unavailable
          </AppText>
          <AppText variant="bodySmall" color={Palette.textMuted} align="center">
            {error}
          </AppText>
          <Button label="Back to matches" size="sm" onPress={goBack} />
        </Card>
      </View>
    );
  }

  if (proposal) {
    return (
      <View style={styles.screen}>
        <SwapHeader
          name={proposal.profile.user.name}
          avatarUrl={proposal.profile.user.avatarUrl ?? ''}
          activity={proposal.profile.user.location || 'SkillBridge member'}
          onBack={goBack}
          onMore={() =>
            router.push({
              pathname: '/user/[id]',
              params: { id: proposal.profile.user.id },
            })
          }
        />
        <ScrollView contentContainerStyle={styles.content}>
          <SwapProposalForm
            partnerName={proposal.profile.user.name}
            mySkills={proposal.mySkills}
            partnerSkills={proposal.profile.offering.map((item) => item.skill)}
            teachingId={teachingId}
            learningId={learningId}
            message={proposalMessage}
            submitting={submitting}
            onChangeTeaching={setTeachingId}
            onChangeLearning={setLearningId}
            onChangeMessage={setProposalMessage}
            onSubmit={submitProposal}
            onAddSkills={() => router.push('/onboarding/skills')}
          />
        </ScrollView>
      </View>
    );
  }

  if (!workspace) return null;

  const isActive = workspace.swap.status === 'Active';
  const canRespond =
    workspace.swap.status === 'Proposed' && workspace.swap.receiver.id === user?.id;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}>
      <SwapHeader
        name={workspace.partnerName}
        avatarUrl={workspace.partnerAvatarUrl}
        activity={workspace.partnerActivity}
        onBack={goBack}
        onMore={openOptions}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SwapAgreementCard
          agreement={{
            yourSkill: workspace.yourSkill,
            yourSkillIcon: workspace.yourSkillIcon,
            partnerSkill: workspace.partnerSkill,
            partnerSkillIcon: workspace.partnerSkillIcon,
          }}
          partnerName={workspace.partnerName}
          statusLabel={statusLabel(workspace.swap, user?.id)}
        />

        {canRespond ? (
          <View style={styles.responseRow}>
            <Button
              label="Accept swap"
              fullWidth
              onPress={() => respond(true)}
              style={styles.responseButton}
            />
            <Button
              label="Decline"
              variant="secondary"
              onPress={() => respond(false)}
              style={styles.responseButton}
            />
          </View>
        ) : null}

        {workspace.swap.message ? (
          <Card style={styles.noteCard}>
            <AppText variant="caption" color={Palette.textMuted} weight="700">
              PROPOSAL NOTE
            </AppText>
            <AppText variant="bodySmall">{workspace.swap.message}</AppText>
          </Card>
        ) : null}

        {workspace.swap.status === 'Completed' ? (
          <Card style={styles.reviewCard}>
            <View style={styles.reviewIcon}>
              <Star color={Palette.warning} fill={Palette.warning} size={20} strokeWidth={2} />
            </View>
            <View style={styles.reviewCopy}>
              <AppText variant="subtitle" weight="700">
                Swap complete
              </AppText>
              <AppText variant="bodySmall" color={Palette.textMuted}>
                Share honest feedback for {workspace.partnerName} and help other learners.
              </AppText>
            </View>
            <Button
              label="Review your partner"
              size="sm"
              onPress={() =>
                router.push({ pathname: '/impact', params: { swapId: workspace.swap.id } })
              }
            />
          </Card>
        ) : null}

        {isActive ? (
          <>
            <View style={styles.dayDivider}>
              <View style={styles.dividerLine} />
              <AppText variant="caption" color={Palette.textMuted} weight="600">
                Conversation
              </AppText>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.messages}>
              {messages.length === 0 ? (
                <Card style={styles.emptyMessages}>
                  <AppText variant="bodySmall" color={Palette.textMuted} align="center">
                    Say hello and plan your first session.
                  </AppText>
                </Card>
              ) : (
                messages.map((message) => (
                  <SwapMessageBubble
                    key={message.id}
                    message={message}
                    partnerName={workspace.partnerName}
                    partnerAvatarUrl={workspace.partnerAvatarUrl}
                    onJoinSession={joinSession}
                  />
                ))
              )}
            </View>
          </>
        ) : (
          <Card style={styles.noteCard}>
            <AppText variant="bodySmall" color={Palette.textMuted} align="center">
              {workspace.swap.status === 'Proposed'
                ? 'Chat unlocks as soon as the swap is accepted.'
                : `This exchange is ${workspace.swap.status.toLowerCase()}.`}
            </AppText>
          </Card>
        )}
      </ScrollView>

      {isActive ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, Spacing.two) }]}>
          <View style={styles.footerInner}>
            <View style={styles.finishRow}>
              <AppText variant="caption" color={Palette.textMuted} style={styles.finishCopy}>
                Finished your lessons?
              </AppText>
              <Button
                label="Mark Finished"
                variant="ghost"
                size="sm"
                icon={CheckCircle2}
                onPress={markFinished}
              />
            </View>
            <SwapComposer
              value={draft}
              onChangeText={setDraft}
              onSend={sendMessage}
              onAttach={() =>
                Alert.alert('Attach a file', 'File sharing is not available yet.')
              }
            />
          </View>
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.background,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  stateCard: {
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
    width: '100%',
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
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  responseRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  responseButton: {
    flex: 1,
  },
  noteCard: {
    gap: 4,
    padding: Spacing.three,
  },
  reviewCard: {
    gap: Spacing.two,
    padding: Spacing.three,
  },
  reviewIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.warningSoft,
  },
  reviewCopy: {
    gap: 2,
  },
  dayDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Palette.border,
  },
  messages: {
    gap: 12,
  },
  emptyMessages: {
    alignItems: 'center',
    padding: Spacing.three,
  },
  footer: {
    backgroundColor: Palette.surface,
    borderTopWidth: 1,
    borderTopColor: Palette.border,
    paddingTop: Spacing.two,
  },
  footerInner: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  finishRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  finishCopy: {
    flex: 1,
  },
});
