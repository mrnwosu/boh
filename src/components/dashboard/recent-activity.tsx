"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Trophy, Brain, Clock, Star, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type QuizActivity = {
  id: string;
  type: "quiz";
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Date;
};

type FlashcardActivity = {
  id: string;
  type: "flashcard";
  topic: string;
  cardsStudied: number;
  mastered: number;
  timestamp: Date;
};

type ActivityItem = QuizActivity | FlashcardActivity;

interface RecentActivityProps {
  activities: ActivityItem[];
}

function formatTopicName(topic: string): string {
  return topic
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getTopicSlug(topic: string): string {
  return topic.replace(/_/g, "-");
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-2 font-medium text-foreground">No activity yet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Start studying flashcards or take a quiz to see your progress here!
            </p>
            <div className="flex gap-3">
              <Link
                href="/flashcards"
                className="inline-flex items-center gap-1 rounded-lg bg-kkpsi-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-kkpsi-navy-light"
              >
                <Brain className="h-4 w-4" />
                Study Cards
              </Link>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Trophy className="h-4 w-4" />
                Take Quiz
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Recent Activity
        </CardTitle>
        <span className="text-xs text-muted-foreground">
          {activities.length} recent {activities.length === 1 ? "activity" : "activities"}
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={
                activity.type === "quiz"
                  ? "/quizzes"
                  : `/flashcards/${getTopicSlug(activity.topic)}`
              }
              className="group flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-kkpsi-navy/30 hover:bg-muted/50 hover:shadow-sm"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
                  activity.type === "quiz"
                    ? "bg-kkpsi-gold/20"
                    : "bg-kkpsi-navy/10 dark:bg-kkpsi-navy-light/20"
                }`}
              >
                {activity.type === "quiz" ? (
                  <Trophy className="h-5 w-5 text-kkpsi-gold" />
                ) : (
                  <Brain className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    {activity.type === "quiz" ? "Completed Quiz" : "Studied Flashcards"}
                  </p>
                  {activity.type === "flashcard" && activity.mastered > 0 && (
                    <div className="flex items-center gap-0.5 text-kkpsi-gold">
                      <Star className="h-3 w-3 fill-current" />
                      <span className="text-xs">{activity.mastered}</span>
                    </div>
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {formatTopicName(activity.topic)}
                  {activity.type === "flashcard" && (
                    <span> &middot; {activity.cardsStudied} cards</span>
                  )}
                  {activity.type === "quiz" && (
                    <span>
                      {" "}
                      &middot; {activity.correctAnswers}/{activity.totalQuestions} correct
                    </span>
                  )}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {activity.type === "quiz" && (
                  <Badge
                    variant="outline"
                    className={
                      activity.score >= 90
                        ? "border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : activity.score >= 70
                        ? "border-kkpsi-gold/50 bg-kkpsi-gold/20 text-kkpsi-navy dark:text-kkpsi-gold"
                        : "border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                    }
                  >
                    {Math.round(activity.score)}%
                  </Badge>
                )}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
