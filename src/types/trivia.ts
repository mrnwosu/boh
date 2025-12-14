/**
 * Type definitions for trivia questions and quiz data
 */

export interface TriviaQuestion {
  id: number;
  questionVersions: string[];
  correctAnswer: string;
  wrongAnswers: string[];
  tags: string[];
  description?: string; // Optional description shown with the answer (currently only for bohumil_makovsky)
}

export interface TriviaFile {
  gameTitle: string;
  description: string;
  totalQuestions: number;
  questions: TriviaQuestion[];
}

export type TopicSlug =
  | "chapters"
  | "founding_fathers"
  | "awards_and_jewelry"
  | "bohumil_makovsky"
  | "districts"
  | "hbcu_chapters"
  | "nib";

export interface TopicInfo {
  slug: TopicSlug;
  title: string;
  description: string;
  fileName: string;
  totalQuestions: number;
}

export interface QuizConfig {
  topic: TopicSlug | "mixed";
  tags?: string[];
  questionCount: number;
  isTimed: boolean;
  timePerQuestion?: number; // seconds
}

export interface QuizQuestion {
  id: string;
  topic: TopicSlug;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSubmission {
  questionId: string;
  topic: TopicSlug;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTaken?: number; // seconds
}
