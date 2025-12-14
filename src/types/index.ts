/**
 * Central export for all types
 */

export type * from "./trivia";
export type * from "./chapter";
export type * from "./president";

// Flashcard types
export interface FlashcardResponse {
  quality: 0 | 1 | 2 | 3 | 4 | 5; // SM-2 quality rating
}

export interface FlashcardDue {
  questionId: string;
  topic: string;
  question: string;
  answer: string;
  status: "NOT_STARTED" | "LEARNING" | "REVIEWING" | "MASTERED";
  nextReview: Date | null;
}

// Dashboard stats
export interface UserStats {
  totalCardsStudied: number;
  cardsMastered: number;
  cardsInProgress: number;
  cardsDue: number;
  totalQuizzes: number;
  averageQuizScore: number;
  currentStreak: number;
  longestStreak: number;
}

export interface TopicProgress {
  topic: string;
  totalCards: number;
  mastered: number;
  learning: number;
  notStarted: number;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  quizzesTaken?: number;
  averageScore?: number;
}
