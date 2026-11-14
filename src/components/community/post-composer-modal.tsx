import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';

import { categoryFilters } from '@/constants/content';
import { Palette, Typography, Radius, Spacing, Shadows } from '@/constants/theme';
import type { PostCategory } from '@/types';

interface PostComposerModalProps {
  visible: boolean;
  onClose: () => void;
  onPublish: (text: string, category: PostCategory) => void;
}

export function PostComposerModal({
  visible,
  onClose,
  onPublish,
}: PostComposerModalProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('discussion');

  const handlePublish = () => {
    if (!content.trim()) return;
    onPublish(content.trim(), category);
    setContent('');
    setCategory('discussion');
    onClose();
  };

  const categories = categoryFilters.filter((c) => c.id !== 'all');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Share with Community</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <X size={20} color={Palette.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Category Selector */}
          <Text style={styles.sectionLabel}>Select Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((c) => {
              const isSelected = category === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={[
                    styles.catChip,
                    isSelected && styles.activeCatChip,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catChipText,
                      isSelected && styles.activeCatChipText,
                    ]}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Text Input */}
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Ask a question, share a project, or post a learning opportunity..."
            placeholderTextColor={Palette.textMuted}
            value={content}
            onChangeText={setContent}
            style={styles.input}
            textAlignVertical="top"
          />

          {/* Footer action */}
          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePublish}
              style={[
                styles.publishBtn,
                !content.trim() && styles.publishBtnDisabled,
              ]}
              disabled={!content.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.publishText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.four,
    ...Shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  title: {
    ...(Typography.title as object),
    fontSize: 18,
    color: Palette.text,
  },
  closeBtn: {
    padding: Spacing.one,
    borderRadius: Radius.full,
    backgroundColor: Palette.surfaceMuted,
  },
  sectionLabel: {
    ...(Typography.caption as object),
    color: Palette.textMuted,
    marginBottom: Spacing.one,
    fontWeight: '600',
  },
  categoryScroll: {
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  catChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
    backgroundColor: Palette.surfaceMuted,
  },
  activeCatChip: {
    backgroundColor: Palette.primary,
  },
  catChipText: {
    ...(Typography.caption as object),
    color: Palette.textMuted,
    fontWeight: '600',
  },
  activeCatChipText: {
    color: Palette.surface,
  },
  input: {
    minHeight: 110,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.border,
    backgroundColor: Palette.surfaceMuted,
    padding: Spacing.three,
    ...(Typography.body as object),
    color: Palette.text,
    marginBottom: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cancelBtn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  cancelText: {
    ...(Typography.label as object),
    color: Palette.textMuted,
  },
  publishBtn: {
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
  publishBtnDisabled: {
    opacity: 0.5,
  },
  publishText: {
    ...(Typography.label as object),
    color: Palette.surface,
    fontWeight: '600',
  },
});
