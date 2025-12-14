/**
 * Quiz Generator
 * Generates randomized quizzes from trivia data
 */

import { type QuizConfig, type QuizQuestion, type TopicSlug } from "~/types";
import { loadTriviaByTopic, loadAllTrivia, TOPICS } from "~/lib/content/trivia-loader";

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Generate a quiz based on configuration
 */
export function generateQuiz(config: QuizConfig): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  if (config.topic === "mixed") {
    // Load all trivia and mix questions from all topics
    const allTrivia = loadAllTrivia();
    const allQuestions: Array<{ topic: TopicSlug; triviaQ: any }> = [];

    for (const [topic, triviaFile] of allTrivia) {
      for (const q of triviaFile.questions) {
        // Filter by tags if specified
        if (config.tags && config.tags.length > 0) {
          const hasTag = config.tags.some((tag) => q.tags.includes(tag));
          if (!hasTag) continue;
        }
        allQuestions.push({ topic, triviaQ: q });
      }
    }

    // Shuffle and take requested amount
    const shuffled = shuffleArray(allQuestions);
    const selected = shuffled.slice(0, config.questionCount);

    // Convert to quiz questions
    for (const { topic, triviaQ } of selected) {
      const quizQuestion = convertToQuizQuestion(topic, triviaQ);
      questions.push(quizQuestion);
    }
  } else {
    // Single topic quiz
    const trivia = loadTriviaByTopic(config.topic);
    let filteredQuestions = trivia.questions;

    // Filter by tags if specified
    if (config.tags && config.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter((q) =>
        config.tags!.some((tag) => q.tags.includes(tag)),
      );
    }

    // Shuffle and take requested amount
    const shuffled = shuffleArray(filteredQuestions);
    const selected = shuffled.slice(0, config.questionCount);

    // Convert to quiz questions
    for (const triviaQ of selected) {
      const quizQuestion = convertToQuizQuestion(config.topic, triviaQ);
      questions.push(quizQuestion);
    }
  }

  return questions;
}

/**
 * Convert trivia question to quiz question format
 */
function convertToQuizQuestion(topic: TopicSlug, triviaQ: any): QuizQuestion {
  // Pick a random question version
  const questionText =
    triviaQ.questionVersions[
      Math.floor(Math.random() * triviaQ.questionVersions.length)
    ]!;

  // Create answer options (correct + 3 random wrong answers)
  const wrongAnswers = shuffleArray(triviaQ.wrongAnswers).slice(0, 3);
  const allOptions = shuffleArray([
    triviaQ.correctAnswer,
    ...wrongAnswers,
  ]);

  return {
    id: `${topic}-${triviaQ.id}`,
    topic,
    question: questionText,
    options: allOptions,
    correctAnswer: triviaQ.correctAnswer,
  };
}

/**
 * Get the maximum number of questions available for a config
 */
export function getAvailableQuestionCount(config: Omit<QuizConfig, 'questionCount' | 'isTimed' | 'timePerQuestion'>): number {
  if (config.topic === "mixed") {
    const allTrivia = loadAllTrivia();
    let count = 0;

    for (const [_, triviaFile] of allTrivia) {
      for (const q of triviaFile.questions) {
        if (config.tags && config.tags.length > 0) {
          const hasTag = config.tags.some((tag) => q.tags.includes(tag));
          if (!hasTag) continue;
        }
        count++;
      }
    }

    return count;
  } else {
    const trivia = loadTriviaByTopic(config.topic);
    let questions = trivia.questions;

    if (config.tags && config.tags.length > 0) {
      questions = questions.filter((q) =>
        config.tags!.some((tag) => q.tags.includes(tag)),
      );
    }

    return questions.length;
  }
}
