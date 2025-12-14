/**
 * Trivia JSON loader
 * Loads and caches trivia questions from JSON files in the reference directory
 */

import fs from "fs";
import path from "path";
import { type TriviaFile, type TopicSlug } from "~/types";
import { TOPICS } from "~/lib/content/topics";

const REFERENCE_DIR = path.join(process.cwd(), "reference");

// Cache for loaded trivia data
const triviaCache = new Map<TopicSlug, TriviaFile>();

// Re-export TOPICS for backwards compatibility
export { TOPICS };

/**
 * Load trivia data for a specific topic
 */
export function loadTriviaByTopic(topic: TopicSlug): TriviaFile {
  // Check cache first
  if (triviaCache.has(topic)) {
    return triviaCache.get(topic)!;
  }

  // Find topic info
  const topicInfo = TOPICS.find((t) => t.slug === topic);
  if (!topicInfo) {
    throw new Error(`Unknown topic: ${topic}`);
  }

  // Load from file
  const filePath = path.join(REFERENCE_DIR, topicInfo.fileName);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(fileContents) as TriviaFile;

  // Cache and return
  triviaCache.set(topic, data);
  return data;
}

/**
 * Load all trivia data
 */
export function loadAllTrivia(): Map<TopicSlug, TriviaFile> {
  for (const topic of TOPICS) {
    loadTriviaByTopic(topic.slug);
  }
  return triviaCache;
}

/**
 * Get all available tags from all trivia files
 */
export function getAllTags(): string[] {
  const allTrivia = loadAllTrivia();
  const tagsSet = new Set<string>();

  for (const [_, triviaFile] of allTrivia) {
    for (const question of triviaFile.questions) {
      for (const tag of question.tags) {
        tagsSet.add(tag);
      }
    }
  }

  return Array.from(tagsSet).sort();
}

/**
 * Get tags for a specific topic
 */
export function getTagsForTopic(topic: TopicSlug): string[] {
  const trivia = loadTriviaByTopic(topic);
  const tagsSet = new Set<string>();

  for (const question of trivia.questions) {
    for (const tag of question.tags) {
      tagsSet.add(tag);
    }
  }

  return Array.from(tagsSet).sort();
}
