-- AlterTable
ALTER TABLE "User" ADD COLUMN     "customAvatar" TEXT,
ADD COLUMN     "dailyCardGoal" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "dailyQuizGoal" INTEGER NOT NULL DEFAULT 1;
