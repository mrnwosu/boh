/**
 * Daily Streak Manager
 * Shared utility for updating user activity streaks
 * Used by both flashcard and quiz routers
 */

import type { PrismaClient } from "@prisma/client";

type ActivityType = "card" | "quiz";

/**
 * Updates the user's daily streak based on activity
 * Handles streak creation, continuation, and reset logic
 */
export async function updateDailyStreak(
  db: PrismaClient,
  userId: string,
  activityType: ActivityType
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const streak = await db.dailyStreak.findUnique({
    where: { userId },
  });

  const incrementField = activityType === "card" ? "totalCards" : "totalQuizzes";

  if (!streak) {
    // Create new streak record
    await db.dailyStreak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
        totalDaysActive: 1,
        [incrementField]: 1,
      },
    });
    return;
  }

  const lastActivity = streak.lastActivityDate
    ? new Date(streak.lastActivityDate)
    : null;

  if (!lastActivity) {
    // No previous activity date recorded
    await db.dailyStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActivityDate: today,
        totalDaysActive: { increment: 1 },
        [incrementField]: { increment: 1 },
      },
    });
    return;
  }

  lastActivity.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor(
    (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) {
    // Same day - just increment activity count
    await db.dailyStreak.update({
      where: { userId },
      data: {
        [incrementField]: { increment: 1 },
      },
    });
  } else if (daysDiff === 1) {
    // Consecutive day - extend streak
    const newStreak = streak.currentStreak + 1;
    await db.dailyStreak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastActivityDate: today,
        totalDaysActive: { increment: 1 },
        [incrementField]: { increment: 1 },
      },
    });
  } else {
    // Streak broken - reset to 1
    await db.dailyStreak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        lastActivityDate: today,
        totalDaysActive: { increment: 1 },
        [incrementField]: { increment: 1 },
      },
    });
  }
}
