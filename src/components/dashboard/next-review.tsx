"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { formatDistanceToNow, isPast, differenceInMinutes } from "date-fns";

interface NextReviewProps {
  dueNow: number;
  nextReviewDate: Date | null;
  nextReviewTopic: string | null;
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

export function NextReview({
  dueNow,
  nextReviewDate,
  nextReviewTopic,
}: NextReviewProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!nextReviewDate) return;

    const updateTime = () => {
      if (isPast(nextReviewDate)) {
        setTimeLeft("now");
        setIsUrgent(true);
      } else {
        const mins = differenceInMinutes(nextReviewDate, new Date());
        setIsUrgent(mins <= 60);
        setTimeLeft(formatDistanceToNow(nextReviewDate, { addSuffix: false }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [nextReviewDate]);

  // If cards are due now
  if (dueNow > 0) {
    return (
      <Link href="/flashcards">
        <Card className="group cursor-pointer border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 transition-all hover:border-orange-400 hover:shadow-md dark:border-orange-800 dark:from-orange-950/30 dark:to-amber-950/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-orange-700 dark:text-orange-300">
                {dueNow} card{dueNow !== 1 ? "s" : ""} due for review
              </p>
              <p className="text-sm text-orange-600/80 dark:text-orange-400/80">
                Review now to maintain your progress
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-orange-500 transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </Link>
    );
  }

  // If no cards due and no upcoming review
  if (!nextReviewDate) {
    return (
      <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-700 dark:text-green-300">
              No reviews scheduled
            </p>
            <p className="text-sm text-green-600/80 dark:text-green-400/80">
              Start studying flashcards to schedule reviews
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show countdown to next review
  return (
    <Link href={nextReviewTopic ? `/flashcards/${getTopicSlug(nextReviewTopic)}` : "/flashcards"}>
      <Card
        className={`group cursor-pointer transition-all hover:shadow-md ${
          isUrgent
            ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-orange-800 dark:from-orange-950/30 dark:to-amber-950/30"
            : "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-950/30 dark:to-indigo-950/30"
        }`}
      >
        <CardContent className="flex items-center gap-3 p-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isUrgent ? "bg-orange-500/20" : "bg-blue-500/20"
            }`}
          >
            <Clock
              className={`h-5 w-5 ${
                isUrgent
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <p
              className={`font-medium ${
                isUrgent
                  ? "text-orange-700 dark:text-orange-300"
                  : "text-blue-700 dark:text-blue-300"
              }`}
            >
              Next review in {timeLeft}
            </p>
            <p
              className={`text-sm ${
                isUrgent
                  ? "text-orange-600/80 dark:text-orange-400/80"
                  : "text-blue-600/80 dark:text-blue-400/80"
              }`}
            >
              {nextReviewTopic ? formatTopicName(nextReviewTopic) : "Multiple topics"}
            </p>
          </div>
          <ArrowRight
            className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
              isUrgent ? "text-orange-500" : "text-blue-500"
            }`}
          />
        </CardContent>
      </Card>
    </Link>
  );
}
