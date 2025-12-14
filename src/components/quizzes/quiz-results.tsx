"use client";

import Link from "next/link";
import { Trophy, CheckCircle2, XCircle, Clock, RefreshCw, ArrowRight, LayoutDashboard } from "lucide-react";
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
  totalQuestions,
  correctAnswers,
  timeElapsed,
  onRetry,
}: QuizResultsProps) {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;

  const getGrade = () => {
    if (percentage >= 90) return { text: "Excellent!", color: "text-green-600", bg: "bg-green-500" };
    if (percentage >= 80) return { text: "Great Job!", color: "text-blue-600", bg: "bg-blue-500" };
    if (percentage >= 70) return { text: "Good Work!", color: "text-yellow-600", bg: "bg-yellow-500" };
    if (percentage >= 60) return { text: "Keep Practicing", color: "text-orange-600", bg: "bg-orange-500" };
    return { text: "Keep Studying", color: "text-red-600", bg: "bg-red-500" };
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
      <div className="relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-200/50">
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-kkpsi-navy/5 blur-3xl"></div>

        {/* Trophy and Score */}
        <div className="relative mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-kkpsi-gold/20 to-amber-100 p-6">
            <Trophy className="h-16 w-16 text-kkpsi-gold" />
          </div>
          <h2 className={`mb-2 font-serif text-3xl font-bold ${grade.color}`}>
            {grade.text}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-6xl font-bold text-kkpsi-navy">{percentage}</span>
            <span className="text-2xl font-medium text-gray-400">%</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4 ring-1 ring-green-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-red-50 p-4 ring-1 ring-red-100">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
              <p className="text-sm text-gray-600">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Time Elapsed */}
        {timeElapsed !== undefined && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-gray-50 p-4 ring-1 ring-gray-100">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-lg font-semibold text-gray-700">{formatTime(timeElapsed)}</span>
            <span className="text-sm text-gray-500">total time</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">Accuracy</span>
            <span className="text-gray-500">{correctAnswers} / {totalQuestions}</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Action Buttons */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Button
            onClick={onRetry}
            className="gap-2 bg-kkpsi-navy shadow-lg shadow-kkpsi-navy/25 hover:bg-kkpsi-navy-light"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/quizzes">
              <ArrowRight className="h-4 w-4" />
              New Quiz
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Encouragement Card */}
      <div className="rounded-xl bg-gradient-to-br from-kkpsi-navy/5 to-kkpsi-gold/5 p-6 text-center ring-1 ring-gray-200/50">
        <p className="text-gray-700">
          {percentage >= 80
            ? "Outstanding performance! You really know your KKPsi knowledge."
            : percentage >= 60
              ? "Good effort! Review the material and try again to improve your score."
              : "Keep studying! Use the flashcards to reinforce your knowledge."}
        </p>
        {percentage < 80 && (
          <Button asChild variant="link" className="mt-2 text-kkpsi-navy">
            <Link href="/flashcards">
              Study with Flashcards
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
