/**
 * Dashboard tRPC Router
 * Handles dashboard-specific data fetching including streaks, stats, and activity
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export const dashboardRouter = createTRPCRouter({
  // Get user's streak data
  getStreak: protectedProcedure.query(async ({ ctx }) => {
    const streak = await ctx.db.dailyStreak.findUnique({
      where: { userId: ctx.session.user.id },
    });

    return {
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      totalDaysActive: streak?.totalDaysActive ?? 0,
      totalCards: streak?.totalCards ?? 0,
      totalQuizzes: streak?.totalQuizzes ?? 0,
      lastActivityDate: streak?.lastActivityDate ?? null,
    };
  }),

  // Get weekly activity data for chart
  getWeeklyActivity: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);

    // Get quiz attempts for the last 7 days
    const quizAttempts = await ctx.db.quizAttempt.findMany({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: startOfDay(sevenDaysAgo),
          lte: endOfDay(today),
        },
      },
      select: {
        createdAt: true,
        score: true,
      },
    });

    // Get flashcard activity for the last 7 days
    const flashcardActivity = await ctx.db.flashcardProgress.findMany({
      where: {
        userId: ctx.session.user.id,
        lastReview: {
          gte: startOfDay(sevenDaysAgo),
          lte: endOfDay(today),
        },
      },
      select: {
        lastReview: true,
      },
    });

    // Build daily activity map
    const dailyData: Record<string, { quizzes: number; cards: number; date: string }> = {};

    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const key = format(date, "yyyy-MM-dd");
      dailyData[key] = {
        date: format(date, "EEE"),
        quizzes: 0,
        cards: 0,
      };
    }

    // Count quizzes per day
    for (const attempt of quizAttempts) {
      const key = format(attempt.createdAt, "yyyy-MM-dd");
      if (dailyData[key]) {
        dailyData[key].quizzes++;
      }
    }

    // Count cards per day
    for (const progress of flashcardActivity) {
      if (progress.lastReview) {
        const key = format(progress.lastReview, "yyyy-MM-dd");
        if (dailyData[key]) {
          dailyData[key].cards++;
        }
      }
    }

    return Object.values(dailyData);
  }),

  // Get activity heatmap data (last 12 weeks)
  getActivityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const twelveWeeksAgo = subDays(today, 83); // 12 weeks = 84 days

    // Get all activity in the date range
    const [quizAttempts, flashcardActivity] = await Promise.all([
      ctx.db.quizAttempt.findMany({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: startOfDay(twelveWeeksAgo),
            lte: endOfDay(today),
          },
        },
        select: { createdAt: true },
      }),
      ctx.db.flashcardProgress.findMany({
        where: {
          userId: ctx.session.user.id,
          lastReview: {
            gte: startOfDay(twelveWeeksAgo),
            lte: endOfDay(today),
          },
        },
        select: { lastReview: true },
      }),
    ]);

    // Build activity count per day
    const activityMap: Record<string, number> = {};

    for (const attempt of quizAttempts) {
      const key = format(attempt.createdAt, "yyyy-MM-dd");
      activityMap[key] = (activityMap[key] ?? 0) + 1;
    }

    for (const progress of flashcardActivity) {
      if (progress.lastReview) {
        const key = format(progress.lastReview, "yyyy-MM-dd");
        activityMap[key] = (activityMap[key] ?? 0) + 1;
      }
    }

    // Generate array for last 84 days
    const heatmapData: Array<{ date: string; count: number; level: number }> = [];

    for (let i = 83; i >= 0; i--) {
      const date = subDays(today, i);
      const key = format(date, "yyyy-MM-dd");
      const count = activityMap[key] ?? 0;

      // Calculate level (0-4) based on activity count
      let level = 0;
      if (count > 0) level = 1;
      if (count >= 3) level = 2;
      if (count >= 6) level = 3;
      if (count >= 10) level = 4;

      heatmapData.push({
        date: key,
        count,
        level,
      });
    }

    return heatmapData;
  }),

  // Get topic performance for recommendations
  getTopicPerformance: protectedProcedure.query(async ({ ctx }) => {
    // Get flashcard progress grouped by topic
    const flashcardProgress = await ctx.db.flashcardProgress.findMany({
      where: { userId: ctx.session.user.id },
    });

    // Get quiz stats by topic
    const quizAttempts = await ctx.db.quizAttempt.findMany({
      where: { userId: ctx.session.user.id },
    });

    // Calculate performance per topic
    const topicStats: Record<
      string,
      {
        topic: string;
        totalCards: number;
        masteredCards: number;
        learningCards: number;
        quizzesTaken: number;
        avgQuizScore: number;
        totalQuizScore: number;
        performanceScore: number;
      }
    > = {};

    // Process flashcard data
    for (const progress of flashcardProgress) {
      if (!topicStats[progress.topic]) {
        topicStats[progress.topic] = {
          topic: progress.topic,
          totalCards: 0,
          masteredCards: 0,
          learningCards: 0,
          quizzesTaken: 0,
          avgQuizScore: 0,
          totalQuizScore: 0,
          performanceScore: 0,
        };
      }

      topicStats[progress.topic]!.totalCards++;
      if (progress.status === "MASTERED") {
        topicStats[progress.topic]!.masteredCards++;
      }
      if (progress.status === "LEARNING" || progress.status === "REVIEWING") {
        topicStats[progress.topic]!.learningCards++;
      }
    }

    // Process quiz data
    for (const attempt of quizAttempts) {
      if (!topicStats[attempt.topic]) {
        topicStats[attempt.topic] = {
          topic: attempt.topic,
          totalCards: 0,
          masteredCards: 0,
          learningCards: 0,
          quizzesTaken: 0,
          avgQuizScore: 0,
          totalQuizScore: 0,
          performanceScore: 0,
        };
      }

      topicStats[attempt.topic]!.quizzesTaken++;
      topicStats[attempt.topic]!.totalQuizScore += attempt.score;
    }

    // Calculate average scores and performance
    for (const topic in topicStats) {
      const stats = topicStats[topic]!;
      if (stats.quizzesTaken > 0) {
        stats.avgQuizScore = stats.totalQuizScore / stats.quizzesTaken;
      }

      // Performance score: weighted combination of mastery % and quiz avg
      const masteryPercent =
        stats.totalCards > 0 ? (stats.masteredCards / stats.totalCards) * 100 : 0;
      const quizWeight = stats.quizzesTaken > 0 ? stats.avgQuizScore : 50; // Default to 50 if no quizzes

      stats.performanceScore = masteryPercent * 0.6 + quizWeight * 0.4;
    }

    const results = Object.values(topicStats);

    // Sort by performance score
    const sorted = results.sort((a, b) => a.performanceScore - b.performanceScore);

    return {
      weakest: sorted.slice(0, 3),
      strongest: sorted.slice(-3).reverse(),
      all: results,
    };
  }),

  // Get user achievements
  getAchievements: protectedProcedure.query(async ({ ctx }) => {
    const [streak, flashcardProgress, quizAttempts] = await Promise.all([
      ctx.db.dailyStreak.findUnique({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.flashcardProgress.findMany({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.quizAttempt.findMany({
        where: { userId: ctx.session.user.id },
      }),
    ]);

    const masteredCount = flashcardProgress.filter((p) => p.status === "MASTERED").length;
    const totalCards = flashcardProgress.length;
    const totalQuizzes = quizAttempts.length;
    const perfectQuizzes = quizAttempts.filter((q) => q.score === 100).length;
    const longestStreak = streak?.longestStreak ?? 0;

    // Define achievements
    const achievements = [
      // Card milestones
      {
        id: "first_card",
        name: "First Steps",
        description: "Study your first flashcard",
        icon: "brain",
        earned: totalCards >= 1,
        progress: Math.min(totalCards, 1),
        target: 1,
      },
      {
        id: "cards_10",
        name: "Getting Started",
        description: "Study 10 flashcards",
        icon: "brain",
        earned: totalCards >= 10,
        progress: Math.min(totalCards, 10),
        target: 10,
      },
      {
        id: "cards_50",
        name: "Dedicated Learner",
        description: "Study 50 flashcards",
        icon: "brain",
        earned: totalCards >= 50,
        progress: Math.min(totalCards, 50),
        target: 50,
      },
      {
        id: "cards_100",
        name: "Century Club",
        description: "Study 100 flashcards",
        icon: "brain",
        earned: totalCards >= 100,
        progress: Math.min(totalCards, 100),
        target: 100,
      },
      // Mastery milestones
      {
        id: "master_10",
        name: "Novice Master",
        description: "Master 10 flashcards",
        icon: "star",
        earned: masteredCount >= 10,
        progress: Math.min(masteredCount, 10),
        target: 10,
      },
      {
        id: "master_25",
        name: "Knowledge Seeker",
        description: "Master 25 flashcards",
        icon: "star",
        earned: masteredCount >= 25,
        progress: Math.min(masteredCount, 25),
        target: 25,
      },
      {
        id: "master_50",
        name: "Scholar",
        description: "Master 50 flashcards",
        icon: "star",
        earned: masteredCount >= 50,
        progress: Math.min(masteredCount, 50),
        target: 50,
      },
      {
        id: "master_100",
        name: "Grand Master",
        description: "Master 100 flashcards",
        icon: "star",
        earned: masteredCount >= 100,
        progress: Math.min(masteredCount, 100),
        target: 100,
      },
      // Quiz milestones
      {
        id: "first_quiz",
        name: "Quiz Taker",
        description: "Complete your first quiz",
        icon: "trophy",
        earned: totalQuizzes >= 1,
        progress: Math.min(totalQuizzes, 1),
        target: 1,
      },
      {
        id: "quizzes_10",
        name: "Quiz Enthusiast",
        description: "Complete 10 quizzes",
        icon: "trophy",
        earned: totalQuizzes >= 10,
        progress: Math.min(totalQuizzes, 10),
        target: 10,
      },
      {
        id: "quizzes_25",
        name: "Quiz Champion",
        description: "Complete 25 quizzes",
        icon: "trophy",
        earned: totalQuizzes >= 25,
        progress: Math.min(totalQuizzes, 25),
        target: 25,
      },
      {
        id: "perfect_quiz",
        name: "Perfectionist",
        description: "Get 100% on a quiz",
        icon: "zap",
        earned: perfectQuizzes >= 1,
        progress: Math.min(perfectQuizzes, 1),
        target: 1,
      },
      {
        id: "perfect_5",
        name: "Flawless",
        description: "Get 100% on 5 quizzes",
        icon: "zap",
        earned: perfectQuizzes >= 5,
        progress: Math.min(perfectQuizzes, 5),
        target: 5,
      },
      // Streak milestones
      {
        id: "streak_3",
        name: "On Fire",
        description: "Achieve a 3-day streak",
        icon: "flame",
        earned: longestStreak >= 3,
        progress: Math.min(longestStreak, 3),
        target: 3,
      },
      {
        id: "streak_7",
        name: "Week Warrior",
        description: "Achieve a 7-day streak",
        icon: "flame",
        earned: longestStreak >= 7,
        progress: Math.min(longestStreak, 7),
        target: 7,
      },
      {
        id: "streak_30",
        name: "Monthly Master",
        description: "Achieve a 30-day streak",
        icon: "flame",
        earned: longestStreak >= 30,
        progress: Math.min(longestStreak, 30),
        target: 30,
      },
    ];

    const earnedCount = achievements.filter((a) => a.earned).length;

    return {
      achievements,
      earnedCount,
      totalCount: achievements.length,
    };
  }),

  // Get next review info
  getNextReview: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();

    // Get the next card due for review
    const nextDue = await ctx.db.flashcardProgress.findFirst({
      where: {
        userId: ctx.session.user.id,
        nextReview: { gt: now },
      },
      orderBy: { nextReview: "asc" },
      select: { nextReview: true, topic: true },
    });

    // Get cards currently due
    const dueNow = await ctx.db.flashcardProgress.count({
      where: {
        userId: ctx.session.user.id,
        OR: [{ nextReview: null }, { nextReview: { lte: now } }],
      },
    });

    return {
      dueNow,
      nextReviewDate: nextDue?.nextReview ?? null,
      nextReviewTopic: nextDue?.topic ?? null,
    };
  }),

  // Get user goals
  getGoals: protectedProcedure.query(async ({ ctx }) => {
    // For now, use default goals - could be stored in DB later
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    // Count today's activity
    const [todayQuizzes, todayCards] = await Promise.all([
      ctx.db.quizAttempt.count({
        where: {
          userId: ctx.session.user.id,
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),
      ctx.db.flashcardProgress.count({
        where: {
          userId: ctx.session.user.id,
          lastReview: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
      }),
    ]);

    return {
      dailyCardGoal: 10,
      dailyQuizGoal: 1,
      cardsToday: todayCards,
      quizzesToday: todayQuizzes,
    };
  }),

  // Get recent activity (both quizzes and flashcards)
  getRecentActivity: protectedProcedure
    .input(z.object({ limit: z.number().optional().default(10) }))
    .query(async ({ ctx, input }) => {
      // Get recent quiz attempts
      const quizAttempts = await ctx.db.quizAttempt.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        select: {
          id: true,
          topic: true,
          score: true,
          totalQuestions: true,
          correctAnswers: true,
          createdAt: true,
        },
      });

      // Get recent flashcard sessions (grouped by topic and day)
      const recentFlashcards = await ctx.db.flashcardProgress.findMany({
        where: {
          userId: ctx.session.user.id,
          lastReview: { not: null },
        },
        orderBy: { lastReview: "desc" },
        take: 50, // Get more to group
        select: {
          topic: true,
          lastReview: true,
          status: true,
        },
      });

      // Group flashcard activity by topic and day
      const flashcardSessions = new Map<
        string,
        { topic: string; date: Date; cardsStudied: number; mastered: number }
      >();

      for (const fc of recentFlashcards) {
        if (!fc.lastReview) continue;
        const dayKey = `${fc.topic}-${format(fc.lastReview, "yyyy-MM-dd")}`;

        if (!flashcardSessions.has(dayKey)) {
          flashcardSessions.set(dayKey, {
            topic: fc.topic,
            date: fc.lastReview,
            cardsStudied: 0,
            mastered: 0,
          });
        }

        const session = flashcardSessions.get(dayKey)!;
        session.cardsStudied++;
        if (fc.status === "MASTERED") {
          session.mastered++;
        }
      }

      // Combine and sort activities
      type Activity =
        | {
            id: string;
            type: "quiz";
            topic: string;
            score: number;
            totalQuestions: number;
            correctAnswers: number;
            timestamp: Date;
          }
        | {
            id: string;
            type: "flashcard";
            topic: string;
            cardsStudied: number;
            mastered: number;
            timestamp: Date;
          };

      const activities: Activity[] = [
        ...quizAttempts.map((q) => ({
          id: q.id,
          type: "quiz" as const,
          topic: q.topic,
          score: q.score,
          totalQuestions: q.totalQuestions,
          correctAnswers: q.correctAnswers,
          timestamp: q.createdAt,
        })),
        ...Array.from(flashcardSessions.values()).map((fc, idx) => ({
          id: `fc-${idx}`,
          type: "flashcard" as const,
          topic: fc.topic,
          cardsStudied: fc.cardsStudied,
          mastered: fc.mastered,
          timestamp: fc.date,
        })),
      ];

      // Sort by timestamp and limit
      activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return activities.slice(0, input.limit);
    }),
});
