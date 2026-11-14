import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { categoryFilters } from '@/constants/content';
import { Palette, Typography, Radius, Spacing } from '@/constants/theme';
import type { PostCategory } from '@/types';

interface CategoryFilterBarProps {
  selected: PostCategory;
  onSelect: (category: PostCategory) => void;
}

export function CategoryFilterBar({ selected, onSelect }: CategoryFilterBarProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categoryFilters.map((cat) => {
          const isActive = selected === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => onSelect(cat.id)}
              style={[styles.chip, isActive && styles.activeChip]}
            >
              <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.surface,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Palette.border,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.full,
    backgroundColor: Palette.surfaceMuted,
  },
  activeChip: {
    backgroundColor: Palette.primary,
  },
  chipText: {
    ...(Typography.label as object),
    color: Palette.textMuted,
  },
  activeChipText: {
    color: Palette.surface,
    fontWeight: '600',
  },
});
