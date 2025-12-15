"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TrendingDown, TrendingUp, ArrowRight, Lightbulb } from "lucide-react";

interface TopicStats {
  topic: string;
  totalCards: number;
  masteredCards: number;
  learningCards: number;
  quizzesTaken: number;
  avgQuizScore: number;
  performanceScore: number;
}

interface TopicRecommendationsProps {
  weakest: TopicStats[];
  strongest: TopicStats[];
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

export function TopicRecommendations({
  weakest,
  strongest,
}: TopicRecommendationsProps) {
  const hasData = weakest.length > 0 || strongest.length > 0;

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="h-5 w-5 text-kkpsi-gold" />
            Topic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-4">
            Start studying to get personalized topic recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-5 w-5 text-kkpsi-gold" />
          Topic Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Needs Improvement */}
        {weakest.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-orange-500" />
              <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Needs Practice
              </h4>
            </div>
            <div className="space-y-2">
              {weakest.map((topic) => (
                <Link
                  key={topic.topic}
                  href={`/flashcards/${getTopicSlug(topic.topic)}`}
                  className="group flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50/50 p-3 transition-all hover:border-orange-300 hover:bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 dark:hover:border-orange-800 dark:hover:bg-orange-950/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {formatTopicName(topic.topic)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {topic.masteredCards}/{topic.totalCards} mastered
                        {topic.quizzesTaken > 0 && (
                          <> &middot; {Math.round(topic.avgQuizScore)}% quiz avg</>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-orange-300 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                    >
                      {Math.round(topic.performanceScore)}%
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Strong Topics */}
        {strongest.length > 0 && strongest.some((t) => t.performanceScore > 70) && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
                Your Strengths
              </h4>
            </div>
            <div className="space-y-2">
              {strongest
                .filter((t) => t.performanceScore > 70)
                .slice(0, 2)
                .map((topic) => (
                  <div
                    key={topic.topic}
                    className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50/50 p-3 dark:border-green-900 dark:bg-green-950/30"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {formatTopicName(topic.topic)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {topic.masteredCards}/{topic.totalCards} mastered
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300"
                    >
                      {Math.round(topic.performanceScore)}%
                    </Badge>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
