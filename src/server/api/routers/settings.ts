/**
 * Settings tRPC Router
 * Handles user settings and profile management
 */

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Available avatar options (emoji-based for simplicity)
export const AVATAR_OPTIONS = [
  { id: "default", label: "Default", emoji: null },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "trumpet", label: "Trumpet", emoji: "🎺" },
  { id: "drum", label: "Drum", emoji: "🥁" },
  { id: "guitar", label: "Guitar", emoji: "🎸" },
  { id: "microphone", label: "Microphone", emoji: "🎤" },
  { id: "piano", label: "Piano", emoji: "🎹" },
  { id: "star", label: "Star", emoji: "⭐" },
  { id: "fire", label: "Fire", emoji: "🔥" },
  { id: "lightning", label: "Lightning", emoji: "⚡" },
  { id: "rocket", label: "Rocket", emoji: "🚀" },
  { id: "crown", label: "Crown", emoji: "👑" },
  { id: "diamond", label: "Diamond", emoji: "💎" },
  { id: "heart", label: "Heart", emoji: "💜" },
  { id: "book", label: "Book", emoji: "📚" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
] as const;

export const settingsRouter = createTRPCRouter({
  // Get current user settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        displayName: true,
        customAvatar: true,
        showOnLeaderboard: true,
        dailyCardGoal: true,
        dailyQuizGoal: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),

  // Update display name
  updateDisplayName: protectedProcedure
    .input(
      z.object({
        displayName: z
          .string()
          .min(2, "Display name must be at least 2 characters")
          .max(30, "Display name must be 30 characters or less")
          .regex(
            /^[a-zA-Z0-9_\-\s]+$/,
            "Display name can only contain letters, numbers, spaces, underscores, and hyphens"
          )
          .optional()
          .nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { displayName: input.displayName },
        select: { displayName: true },
      });

      return user;
    }),

  // Update custom avatar
  updateAvatar: protectedProcedure
    .input(
      z.object({
        customAvatar: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate avatar is one of the allowed options or null
      const validAvatarIds = AVATAR_OPTIONS.map((a) => a.id);
      if (input.customAvatar && !validAvatarIds.includes(input.customAvatar as any)) {
        throw new Error("Invalid avatar selection");
      }

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { customAvatar: input.customAvatar },
        select: { customAvatar: true },
      });

      return user;
    }),

  // Update leaderboard visibility
  updateLeaderboardVisibility: protectedProcedure
    .input(
      z.object({
        showOnLeaderboard: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { showOnLeaderboard: input.showOnLeaderboard },
        select: { showOnLeaderboard: true },
      });

      return user;
    }),

  // Update daily goals
  updateDailyGoals: protectedProcedure
    .input(
      z.object({
        dailyCardGoal: z.number().min(1).max(100).optional(),
        dailyQuizGoal: z.number().min(1).max(20).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          ...(input.dailyCardGoal !== undefined && { dailyCardGoal: input.dailyCardGoal }),
          ...(input.dailyQuizGoal !== undefined && { dailyQuizGoal: input.dailyQuizGoal }),
        },
        select: { dailyCardGoal: true, dailyQuizGoal: true },
      });

      return user;
    }),

  // Get user stats summary for settings page
  getStatsSummary: protectedProcedure.query(async ({ ctx }) => {
    const [flashcardCount, quizCount, streak] = await Promise.all([
      ctx.db.flashcardProgress.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.quizAttempt.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.dailyStreak.findUnique({
        where: { userId: ctx.session.user.id },
        select: { currentStreak: true, longestStreak: true, totalDaysActive: true },
      }),
    ]);

    return {
      totalCardsStudied: flashcardCount,
      totalQuizzesTaken: quizCount,
      currentStreak: streak?.currentStreak ?? 0,
      longestStreak: streak?.longestStreak ?? 0,
      totalDaysActive: streak?.totalDaysActive ?? 0,
    };
  }),

  // Delete all user progress (dangerous!)
  resetProgress: protectedProcedure
    .input(
      z.object({
        confirmText: z.literal("DELETE MY PROGRESS"),
      })
    )
    .mutation(async ({ ctx }) => {
      // Delete all user progress
      await ctx.db.$transaction([
        ctx.db.flashcardProgress.deleteMany({
          where: { userId: ctx.session.user.id },
        }),
        ctx.db.quizAttempt.deleteMany({
          where: { userId: ctx.session.user.id },
        }),
        ctx.db.dailyStreak.deleteMany({
          where: { userId: ctx.session.user.id },
        }),
      ]);

      return { success: true };
    }),

  // Delete user account entirely (very dangerous!)
  deleteAccount: protectedProcedure
    .input(
      z.object({
        confirmText: z.literal("DELETE MY ACCOUNT"),
      })
    )
    .mutation(async ({ ctx }) => {
      // Delete the user - cascades to all related records (Account, Session, FlashcardProgress, QuizAttempt, DailyStreak)
      await ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      });

      return { success: true };
    }),
});
