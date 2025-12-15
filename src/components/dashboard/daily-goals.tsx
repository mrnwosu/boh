"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Target, Brain, Trophy, CheckCircle2 } from "lucide-react";

interface DailyGoalsProps {
  dailyCardGoal: number;
  dailyQuizGoal: number;
  cardsToday: number;
  quizzesToday: number;
}

export function DailyGoals({
  dailyCardGoal,
  dailyQuizGoal,
  cardsToday,
  quizzesToday,
}: DailyGoalsProps) {
  const cardProgress = Math.min((cardsToday / dailyCardGoal) * 100, 100);
  const quizProgress = Math.min((quizzesToday / dailyQuizGoal) * 100, 100);
  const cardGoalMet = cardsToday >= dailyCardGoal;
  const quizGoalMet = quizzesToday >= dailyQuizGoal;
  const allGoalsMet = cardGoalMet && quizGoalMet;

  return (
    <Card
      className={
        allGoalsMet
          ? "border-green-300 bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:border-green-800 dark:from-green-950/20 dark:to-emerald-950/20"
          : ""
      }
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {allGoalsMet ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Target className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
          )}
          Daily Goals
          {allGoalsMet && (
            <span className="ml-auto text-xs font-normal text-green-600 dark:text-green-400">
              Complete!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cards Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain
                className={`h-4 w-4 ${
                  cardGoalMet
                    ? "text-green-500"
                    : "text-kkpsi-navy dark:text-kkpsi-navy-light"
                }`}
              />
              <span className="text-sm font-medium">Study Cards</span>
            </div>
            <span
              className={`text-sm ${
                cardGoalMet
                  ? "font-medium text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              }`}
            >
              {cardsToday}/{dailyCardGoal}
            </span>
          </div>
          <Progress
            value={cardProgress}
            className={`h-2 ${cardGoalMet ? "[&>div]:bg-green-500" : ""}`}
          />
        </div>

        {/* Quiz Goal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy
                className={`h-4 w-4 ${
                  quizGoalMet
                    ? "text-green-500"
                    : "text-kkpsi-gold"
                }`}
              />
              <span className="text-sm font-medium">Take Quiz</span>
            </div>
            <span
              className={`text-sm ${
                quizGoalMet
                  ? "font-medium text-green-600 dark:text-green-400"
                  : "text-muted-foreground"
              }`}
            >
              {quizzesToday}/{dailyQuizGoal}
            </span>
          </div>
          <Progress
            value={quizProgress}
            className={`h-2 ${quizGoalMet ? "[&>div]:bg-green-500" : ""}`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
