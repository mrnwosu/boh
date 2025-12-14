"use client";

import Link from "next/link";
import { Trophy, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeElapsed?: number;
  onRetry: () => void;
}

export function QuizResults({
  score,
  totalQuestions,
  correctAnswers,
  timeElapsed,
  onRetry,
}: QuizResultsProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getGrade = () => {
    if (percentage >= 90) return { text: "Excellent!", color: "text-green-600" };
    if (percentage >= 80) return { text: "Great Job!", color: "text-blue-600" };
    if (percentage >= 70) return { text: "Good Work!", color: "text-yellow-600" };
    if (percentage >= 60) return { text: "Keep Practicing", color: "text-orange-600" };
    return { text: "Keep Studying", color: "text-red-600" };
  };

  const grade = getGrade();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Main Results Card */}
      <Card className="border-4 border-kkpsi-gold">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-kkpsi-gold/20 p-6">
              <Trophy className="h-16 w-16 text-kkpsi-gold" />
            </div>
          </div>
          <CardTitle className={`text-4xl font-bold ${grade.color}`}>
            {grade.text}
          </CardTitle>
          <p className="text-6xl font-bold text-kkpsi-navy">
            {percentage}%
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border-2 border-green-200 bg-green-50 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                <p className="text-sm text-gray-600">Correct</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border-2 border-red-200 bg-red-50 p-4">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                <p className="text-sm text-gray-600">Incorrect</p>
              </div>
            </div>
          </div>

          {/* Time Elapsed */}
          {timeElapsed !== undefined && (
            <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-kkpsi-gold bg-kkpsi-gold/10 p-4">
              <Clock className="h-6 w-6 text-kkpsi-navy" />
              <div>
                <p className="text-xl font-bold text-kkpsi-navy">{formatTime(timeElapsed)}</p>
                <p className="text-sm text-gray-600">Time Taken</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Accuracy</p>
            <Progress value={percentage} className="h-3" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <Button
              onClick={onRetry}
              className="flex-1 bg-kkpsi-navy hover:bg-kkpsi-navy-light"
              size="lg"
            >
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/quizzes">New Quiz</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Encouragement */}
      <Card className="bg-gradient-to-br from-kkpsi-navy/5 to-kkpsi-gold/5">
        <CardContent className="pt-6 text-center">
          <p className="text-gray-700">
            {percentage >= 80
              ? "Outstanding performance! You really know your KKPsi knowledge."
              : percentage >= 60
                ? "Good effort! Review the material and try again to improve your score."
                : "Keep studying! Use the flashcards to reinforce your knowledge."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
