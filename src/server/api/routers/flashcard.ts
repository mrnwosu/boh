/**
 * Flashcard tRPC Router
 * Handles flashcard progress tracking and spaced repetition
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { loadTriviaByTopic, TOPICS } from "~/lib/content/trivia-loader";
import {
  calculateNextReview,
  determineStatus,
  mapResponseToQuality,
} from "~/lib/spaced-repetition";
import { topicSlugSchema } from "~/lib/schemas/topic";
import { updateDailyStreak } from "~/lib/streak-manager";

export const flashcardRouter = createTRPCRouter({
  // Get all available topics
  getTopics: publicProcedure.query(() => {
    return TOPICS;
  }),

  // Get flashcards for a topic with optional tag filtering
  getCards: publicProcedure
    .input(
      z.object({
        topic: topicSlugSchema,
        tags: z.array(z.string()).optional(),
        limit: z.number().optional(),
      }),
    )
    .query(({ input }) => {
      const trivia = loadTriviaByTopic(input.topic);
      let questions = trivia.questions;

      // Filter by tags if specified
      if (input.tags && input.tags.length > 0) {
        questions = questions.filter((q) =>
          input.tags!.some((tag) => q.tags.includes(tag)),
        );
      }

      // Limit if specified
      if (input.limit) {
        questions = questions.slice(0, input.limit);
      }

      return questions.map((q) => ({
        id: q.id.toString(),
        question: q.questionVersions[0]!, // Use first version for flashcards
        answer: q.correctAnswer,
        tags: q.tags,
        description: q.description,
      }));
    }),

  // Get user's progress for a topic (protected)
  getProgress: protectedProcedure
    .input(z.object({ topic: topicSlugSchema }))
    .query(async ({ ctx, input }) => {
      const progress = await ctx.db.flashcardProgress.findMany({
        where: {
          userId: ctx.session.user.id,
          topic: input.topic,
        },
      });

      return progress;
    }),

  // Get cards due for review (protected)
  getDueCards: protectedProcedure
    .input(
      z.object({
        topic: topicSlugSchema,
        limit: z.number().optional().default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = new Date();

      // Get progress for cards due or never reviewed
      const progress = await ctx.db.flashcardProgress.findMany({
        where: {
          userId: ctx.session.user.id,
          topic: input.topic,
          OR: [
            { nextReview: null },
            { nextReview: { lte: now } },
          ],
        },
        take: input.limit,
        orderBy: {
          nextReview: "asc",
        },
      });

      // Get the actual card content from trivia
      const trivia = loadTriviaByTopic(input.topic);
      const cards = progress.map((p) => {
        const question = trivia.questions.find(
          (q) => q.id.toString() === p.questionId,
        );

        return {
          progressId: p.id,
          questionId: p.questionId,
          question: question?.questionVersions[0] ?? "",
          answer: question?.correctAnswer ?? "",
          status: p.status,
          nextReview: p.nextReview,
          tags: question?.tags ?? [],
          description: question?.description,
        };
      });

      return cards;
    }),

  // Record a flashcard response (protected)
  recordResponse: protectedProcedure
    .input(
      z.object({
        topic: topicSlugSchema,
        questionId: z.string(),
        response: z.enum(["again", "hard", "good", "easy"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const quality = mapResponseToQuality(input.response);

      // Find existing progress or create new
      const existing = await ctx.db.flashcardProgress.findUnique({
        where: {
          userId_questionId_topic: {
            userId: ctx.session.user.id,
            questionId: input.questionId,
            topic: input.topic,
          },
        },
      });

      const currentEaseFactor = existing?.easeFactor ?? 2.5;
      const currentInterval = existing?.interval ?? 0;
      const currentRepetitions = existing?.repetitions ?? 0;

      // Calculate next review
      const sm2Result = calculateNextReview(
        quality,
        currentEaseFactor,
        currentInterval,
        currentRepetitions,
      );

      const newStatus = determineStatus(
        sm2Result.repetitions,
        sm2Result.easeFactor,
      );

      // Update or create progress
      const progress = await ctx.db.flashcardProgress.upsert({
        where: {
          userId_questionId_topic: {
            userId: ctx.session.user.id,
            questionId: input.questionId,
            topic: input.topic,
          },
        },
        update: {
          status: newStatus,
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          nextReview: sm2Result.nextReview,
          lastReview: new Date(),
          timesCorrect:
            quality >= 3
              ? { increment: 1 }
              : existing?.timesCorrect ?? 0,
          timesIncorrect:
            quality < 3
              ? { increment: 1 }
              : existing?.timesIncorrect ?? 0,
        },
        create: {
          userId: ctx.session.user.id,
          questionId: input.questionId,
          topic: input.topic,
          status: newStatus,
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          repetitions: sm2Result.repetitions,
          nextReview: sm2Result.nextReview,
          lastReview: new Date(),
          timesCorrect: quality >= 3 ? 1 : 0,
          timesIncorrect: quality < 3 ? 1 : 0,
        },
      });

      // Update daily streak for flashcard activity
      await updateDailyStreak(ctx.db, ctx.session.user.id, "card");

      return progress;
    }),

  // Get progress summary across all topics (protected)
  getProgressSummary: protectedProcedure.query(async ({ ctx }) => {
    const allProgress = await ctx.db.flashcardProgress.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Group by topic
    const byTopic = allProgress.reduce(
      (acc, p) => {
        if (!acc[p.topic]) {
          acc[p.topic] = {
            topic: p.topic,
            total: 0,
            notStarted: 0,
            learning: 0,
            reviewing: 0,
            mastered: 0,
          };
        }

        acc[p.topic]!.total++;
        if (p.status === "NOT_STARTED") acc[p.topic]!.notStarted++;
        if (p.status === "LEARNING") acc[p.topic]!.learning++;
        if (p.status === "REVIEWING") acc[p.topic]!.reviewing++;
        if (p.status === "MASTERED") acc[p.topic]!.mastered++;

        return acc;
      },
      {} as Record<
        string,
        {
          topic: string;
          total: number;
          notStarted: number;
          learning: number;
          reviewing: number;
          mastered: number;
        }
      >,
    );

    return Object.values(byTopic);
  }),

  // Reset progress for a topic (protected)
  resetProgress: protectedProcedure
    .input(z.object({ topic: topicSlugSchema }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.flashcardProgress.deleteMany({
        where: {
          userId: ctx.session.user.id,
          topic: input.topic,
        },
      });

      return { success: true };
    }),
});
