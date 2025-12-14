/**
 * Shared topic schema definitions
 * Single source of truth for topic types used across the application
 */

import { z } from "zod";

/**
 * Topic slugs for individual topics (no mixed option)
 */
export const topicSlugSchema = z.enum([
  "chapters",
  "founding_fathers",
  "awards_and_jewelry",
  "bohumil_makovsky",
  "districts",
  "hbcu_chapters",
  "nib",
]);

/**
 * Topic slugs including the "mixed" option for quizzes
 */
export const topicSlugWithMixedSchema = z.enum([
  "chapters",
  "founding_fathers",
  "awards_and_jewelry",
  "bohumil_makovsky",
  "districts",
  "hbcu_chapters",
  "nib",
  "mixed",
]);

export type TopicSlug = z.infer<typeof topicSlugSchema>;
export type TopicSlugWithMixed = z.infer<typeof topicSlugWithMixedSchema>;

/**
 * Array of all topic slugs (useful for iteration)
 */
export const TOPIC_SLUGS = topicSlugSchema.options;
export const TOPIC_SLUGS_WITH_MIXED = topicSlugWithMixedSchema.options;
