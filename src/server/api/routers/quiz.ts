/**
 * Quiz tRPC Router
 * Handles quiz generation, submission, and history
 */

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { generateQuiz, getAvailableQuestionCount } from "~/lib/quiz-generator";
import { TOPICS, getTagsForTopic, getAllTags } from "~/lib/content/trivia-loader";

const topicEnum = z.enum([
  "chapters",
  "founding_fathers",
  "awards_and_jewelry",
  "bohumil_makovsky",
  "districts",
  "hbcu_chapters",
  "nib",
  "mixed",
]);

export const quizRouter = createTRPCRouter({
  // Get all available topics
  getTopics: publicProcedure.query(() => {
    return [
      ...TOPICS,
      {
        slug: "mixed" as const,
        title: "Mixed Topics",
        description: "Questions from all categories",
        fileName: "",
        totalQuestions: TOPICS.reduce((sum, t) => sum + t.totalQuestions, 0),
      },
    ];
  }),

  // Get tags for a specific topic
  getTags: publicProcedure
    .input(z.object({ topic: topicEnum }))
    .query(({ input }) => {
      if (input.topic === "mixed") {
        return getAllTags();
      }
      return getTagsForTopic(input.topic);
    }),

  // Get available question count for a given configuration
  getAvailableCount: publicProcedure
    .input(
      z.object({
        topic: topicEnum,
        tags: z.array(z.string()).optional(),
      }),
    )
    .query(({ input }) => {
      return getAvailableQuestionCount({
        topic: input.topic,
        tags: input.tags,
      });
    }),

  // Generate a quiz (public - can be used by guests)
  generateQuiz: publicProcedure
    .input(
      z.object({
        topic: topicEnum,
        tags: z.array(z.string()).optional(),
        questionCount: z.number().min(1).max(100),
        isTimed: z.boolean(),
        timePerQuestion: z.number().optional(),
      }),
    )
    .mutation(({ input }) => {
      const questions = generateQuiz(input);
      return {
        questions,
        config: input,
      };
    }),

  // Submit quiz results (protected - requires authentication)
  submitQuiz: protectedProcedure
    .input(
      z.object({
        topic: topicEnum,
        tags: z.array(z.string()).optional(),
        totalQuestions: z.number(),
        isTimed: z.boolean(),
        timeTaken: z.number().optional(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            topic: z.string(),
            selectedAnswer: z.string(),
            correctAnswer: z.string(),
            isCorrect: z.boolean(),
            timeTaken: z.number().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const correctAnswers = input.answers.filter((a) => a.isCorrect).length;
      const score = (correctAnswers / input.totalQuestions) * 100;

      // Create quiz attempt
      const attempt = await ctx.db.quizAttempt.create({
        data: {
          userId: ctx.session.user.id,
          topic: input.topic,
          tags: input.tags ?? [],
          totalQuestions: input.totalQuestions,
          correctAnswers,
          score,
          timeTaken: input.timeTaken,
          isTimed: input.isTimed,
          answers: {
            create: input.answers.map((answer) => ({
              questionId: answer.questionId,
              topic: answer.topic,
              selectedAnswer: answer.selectedAnswer,
              correctAnswer: answer.correctAnswer,
              isCorrect: answer.isCorrect,
              timeTaken: answer.timeTaken,
            })),
          },
        },
        include: {
          answers: true,
        },
      });

      // Update daily streak
      await updateDailyStreak(ctx.db, ctx.session.user.id);

      return {
        attemptId: attempt.id,
        score,
        correctAnswers,
        totalQuestions: input.totalQuestions,
      };
    }),

  // Get a specific quiz attempt
  getAttempt: protectedProcedure
    .input(z.object({ attemptId: z.string() }))
    .query(async ({ ctx, input }) => {
      const attempt = await ctx.db.quizAttempt.findUnique({
        where: {
          id: input.attemptId,
          userId: ctx.session.user.id,
        },
        include: {
          answers: true,
        },
      });

      if (!attempt) {
        throw new Error("Quiz attempt not found");
      }

      return attempt;
    }),

  // Get quiz history for current user
  getHistory: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().optional().default(10),
          topic: topicEnum.optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const attempts = await ctx.db.quizAttempt.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input?.topic && { topic: input.topic }),
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input?.limit ?? 10,
      });

      return attempts;
    }),

  // Get topic statistics for current user
  getTopicStats: protectedProcedure.query(async ({ ctx }) => {
    const attempts = await ctx.db.quizAttempt.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    // Group by topic
    const statsByTopic = attempts.reduce(
      (acc, attempt) => {
        if (!acc[attempt.topic]) {
          acc[attempt.topic] = {
            topic: attempt.topic,
            quizzesTaken: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            averageScore: 0,
          };
        }

        acc[attempt.topic]!.quizzesTaken++;
        acc[attempt.topic]!.totalQuestions += attempt.totalQuestions;
        acc[attempt.topic]!.correctAnswers += attempt.correctAnswers;

        return acc;
      },
      {} as Record<
        string,
        {
          topic: string;
          quizzesTaken: number;
          totalQuestions: number;
          correctAnswers: number;
          averageScore: number;
        }
      >,
    );

    // Calculate average scores
    for (const topic in statsByTopic) {
      const stats = statsByTopic[topic]!;
      stats.averageScore =
        (stats.correctAnswers / stats.totalQuestions) * 100;
    }

    return Object.values(statsByTopic);
  }),
});

// Helper function to update daily streak
async function updateDailyStreak(db: any, userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await db.dailyStreak.findUnique({
    where: { userId },
  });

  if (!streak) {
    // Create new streak
    await db.dailyStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        totalDaysActive: 1,
        totalQuizzes: 1,
      },
    });
    return;
  }

  const lastActivity = streak.lastActivityDate
    ? new Date(streak.lastActivityDate)
    : null;

  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === 0) {
      // Same day, just increment quiz count
      await db.dailyStreak.update({
        where: { userId },
        data: {
          totalQuizzes: { increment: 1 },
        },
      });
    } else if (daysDiff === 1) {
      // Consecutive day
      const newStreak = streak.currentStreak + 1;
      await db.dailyStreak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActivityDate: today,
          totalDaysActive: { increment: 1 },
          totalQuizzes: { increment: 1 },
        },
      });
    } else {
      // Streak broken
      await db.dailyStreak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastActivityDate: today,
          totalDaysActive: { increment: 1 },
          totalQuizzes: { increment: 1 },
        },
      });
    }
  }
}
