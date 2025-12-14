"use client";

import { useState, useCallback } from "react";

export interface UseTagSelectionOptions {
  initialTags?: string[];
}

export interface UseTagSelectionReturn {
  /** Currently selected tags */
  selectedTags: string[];
  /** Toggle a tag on/off */
  toggleTag: (tag: string) => void;
  /** Clear all selected tags */
  clearTags: () => void;
  /** Set tags directly */
  setTags: (tags: string[]) => void;
  /** Check if a specific tag is selected */
  isSelected: (tag: string) => boolean;
  /** Number of selected tags */
  count: number;
  /** Whether any tags are selected */
  hasSelection: boolean;
}

/**
 * Hook for managing tag selection state
 * Used in flashcard filtering, quiz configuration, etc.
 */
export function useTagSelection(
  options: UseTagSelectionOptions = {}
): UseTagSelectionReturn {
  const { initialTags = [] } = options;
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  const isSelected = useCallback(
    (tag: string) => selectedTags.includes(tag),
    [selectedTags]
  );

  const count = selectedTags.length;
  const hasSelection = count > 0;

  return {
    selectedTags,
    toggleTag,
    clearTags,
    setTags,
    isSelected,
    count,
    hasSelection,
  };
}
