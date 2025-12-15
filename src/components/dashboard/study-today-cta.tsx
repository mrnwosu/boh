"use client";

import Link from "next/link";
import { Brain, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface StudyTodayCtaProps {
  dueCards: number;
  nextReviewDate: Date | null;
  cardsToday: number;
  dailyGoal: number;
}

export function StudyTodayCta({
  dueCards,
  nextReviewDate,
  cardsToday,
  dailyGoal,
}: StudyTodayCtaProps) {
  const goalProgress = Math.min((cardsToday / dailyGoal) * 100, 100);
  const goalMet = cardsToday >= dailyGoal;

  if (dueCards === 0 && goalMet) {
    return (
      <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20">
            <Sparkles className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
              All caught up!
            </h3>
            <p className="text-sm text-green-600 dark:text-green-400">
              You&apos;ve met your daily goal of {dailyGoal} cards. Great work!
              {nextReviewDate && (
                <span className="block mt-1">
                  Next review:{" "}
                  {nextReviewDate.toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group relative overflow-hidden border-2 border-kkpsi-gold bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-kkpsi-gold/0 via-kkpsi-gold/10 to-kkpsi-gold/0 opacity-0 transition-opacity group-hover:opacity-100" />

      <CardContent className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-kkpsi-gold/20 ring-4 ring-kkpsi-gold/30">
          <Brain className="h-7 w-7 text-kkpsi-navy dark:text-kkpsi-navy-light" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-kkpsi-navy dark:text-kkpsi-navy-light">
            {dueCards > 0 ? (
              <>
                {dueCards} card{dueCards !== 1 ? "s" : ""} ready for review!
              </>
            ) : (
              <>Keep learning to reach your daily goal</>
            )}
          </h3>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Daily goal: {cardsToday}/{dailyGoal} cards
              </span>
              <span className="font-medium text-kkpsi-navy dark:text-kkpsi-navy-light">
                {Math.round(goalProgress)}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-kkpsi-navy/10 dark:bg-kkpsi-navy-light/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-kkpsi-navy to-kkpsi-navy-light transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <Link href="/flashcards" className="shrink-0">
          <Button className="group/btn bg-kkpsi-navy hover:bg-kkpsi-navy-light">
            Study Now
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
