/**
 * Quiz configuration URL parameter utilities
 */

import type { TopicSlugWithMixed } from "~/lib/schemas/topic";

export interface QuizConfigParams {
  topic: TopicSlugWithMixed;
  questionCount: number;
  isTimed: boolean;
  timePerQuestion?: number;
  tags?: string[];
}

/**
 * Encodes quiz configuration to URL search parameters
 */
export function encodeQuizConfig(config: QuizConfigParams): URLSearchParams {
  const params = new URLSearchParams({
    topic: config.topic,
    count: config.questionCount.toString(),
    timed: config.isTimed.toString(),
  });

  if (config.tags && config.tags.length > 0) {
    params.set("tags", config.tags.join(","));
  }

  if (config.timePerQuestion) {
    params.set("time", config.timePerQuestion.toString());
  }

  return params;
}

/**
 * Decodes URL search parameters to quiz configuration
 */
export function decodeQuizConfig(searchParams: URLSearchParams): QuizConfigParams {
  const tagsParam = searchParams.get("tags");

  return {
    topic: (searchParams.get("topic") ?? "chapters") as TopicSlugWithMixed,
    questionCount: parseInt(searchParams.get("count") ?? "10"),
    isTimed: searchParams.get("timed") === "true",
    timePerQuestion: parseInt(searchParams.get("time") ?? "10"),
    tags: tagsParam ? tagsParam.split(",").filter(Boolean) : undefined,
  };
}

/**
 * Creates a quiz URL from configuration
 */
export function createQuizUrl(config: QuizConfigParams): string {
  const params = encodeQuizConfig(config);
  return `/quizzes/take?${params.toString()}`;
}
