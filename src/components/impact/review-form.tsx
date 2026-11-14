import { CheckCircle2, Send, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';

type ReviewFormProps = {
  partnerName: string;
  tags: string[];
  onSubmit?: (rating: number, comment?: string) => Promise<void>;
};

const RATING_LABELS = ['', 'Needs work', 'Fair', 'Good', 'Great', 'Outstanding'];

export function ReviewForm({ partnerName, tags, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert('Add a rating', 'Choose a star rating before sharing your review.');
      return;
    }

    const comment = [selectedTags.join(', '), feedback.trim()].filter(Boolean).join(' — ');
    setSubmitting(true);
    try {
      await onSubmit?.(rating, comment || undefined);
      setSubmitted(true);
    } catch (err) {
      Alert.alert(
        'Could not share review',
        err instanceof Error ? err.message : 'Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card style={styles.successCard}>
        <View style={styles.successIcon}>
          <CheckCircle2 color={Palette.success} size={26} strokeWidth={2.2} />
        </View>
        <AppText variant="subtitle" weight="700" align="center">
          Review shared
        </AppText>
        <AppText variant="bodySmall" color={Palette.textMuted} align="center">
          Your {rating}-star review for {partnerName} is now part of the community story.
        </AppText>
        <View style={styles.successStars}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              color={Palette.warning}
              fill={index < rating ? Palette.warning : 'none'}
              size={18}
              strokeWidth={2}
            />
          ))}
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Star color={Palette.warning} fill={Palette.warning} size={18} strokeWidth={2} />
        </View>
        <View style={styles.headerText}>
          <AppText variant="subtitle" weight="700">
            How was your exchange?
          </AppText>
          <AppText variant="bodySmall" color={Palette.textMuted}>
            Share a little feedback for {partnerName}.
          </AppText>
        </View>
      </View>

      <View style={styles.ratingBlock}>
        <View style={styles.stars}>
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1;
            const active = value <= rating;
            return (
              <Pressable
                key={value}
                accessibilityRole="button"
                accessibilityLabel={`${value} star rating`}
                accessibilityState={{ selected: value === rating }}
                hitSlop={4}
                onPress={() => setRating(value)}>
                <Star
                  color={active ? Palette.warning : Palette.borderStrong}
                  fill={active ? Palette.warning : 'none'}
                  size={30}
                  strokeWidth={2}
                />
              </Pressable>
            );
          })}
        </View>
        <AppText variant="caption" color={Palette.warningText} weight="700">
          {RATING_LABELS[rating]}
        </AppText>
      </View>

      <View style={styles.tags}>
        {tags.map((tag) => {
          const selected = selectedTags.includes(tag);
          return (
            <Pressable
              key={tag}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => toggleTag(tag)}
              style={({ pressed }) => [
                styles.tag,
                selected && styles.tagSelected,
                pressed && styles.pressed,
              ]}>
              {selected ? (
                <CheckCircle2 color={Palette.white} size={13} strokeWidth={2.4} />
              ) : null}
              <AppText
                variant="caption"
                color={selected ? Palette.white : Palette.textMuted}
                weight="600">
                {tag}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <TextInput
        value={feedback}
        onChangeText={setFeedback}
        placeholder="What stood out about this exchange?"
        placeholderTextColor={Palette.textMuted}
        selectionColor={Palette.accent}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        style={[styles.feedback, focused && styles.feedbackFocused]}
      />

      <Button
        label={submitting ? 'Sharing...' : 'Share Review'}
        icon={Send}
        fullWidth
        disabled={submitting}
        onPress={submitReview}
        accessibilityLabel={`Share review for ${partnerName}`}
      />

      <AppText variant="caption" color={Palette.textMuted} align="center">
        Honest reviews help learners find the right partner.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: Spacing.three,
    borderRadius: Radius.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.warningSoft,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  ratingBlock: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    backgroundColor: Palette.warningSoft,
    borderWidth: 1,
    borderColor: Palette.warningBorder,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
  },
  tagSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  feedback: {
    ...Typography.body,
    minHeight: 96,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.background,
    color: Palette.text,
  },
  feedbackFocused: {
    backgroundColor: Palette.surface,
    borderColor: Palette.accent,
  },
  pressed: {
    opacity: 0.8,
  },
  successCard: {
    alignItems: 'center',
    gap: 8,
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderColor: Palette.successBorder,
    backgroundColor: Palette.successSoft,
  },
  successIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.surface,
  },
  successStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
