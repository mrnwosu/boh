"use client";

import { useState } from "react";
import Link from "next/link";
import { Trophy, CheckCircle2, XCircle, Clock, RefreshCw, ArrowRight, LayoutDashboard, ChevronDown, ChevronUp, Timer, Target, TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import type { QuizQuestion } from "~/types/trivia";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeElapsed?: number;
  onRetry: () => void;
  questions?: QuizQuestion[];
  answers?: Record<string, string>;
}

export function QuizResults({
  totalQuestions,
  correctAnswers,
  timeElapsed,
  onRetry,
  questions = [],
  answers = {},
}: QuizResultsProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;
  const avgTimePerQuestion = timeElapsed ? Math.round(timeElapsed / totalQuestions) : undefined;

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
      <div className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-xl ring-1 ring-border">
        {/* Background decoration */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-kkpsi-gold/10 blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-kkpsi-navy/5 blur-3xl"></div>

        {/* Trophy and Score */}
        <div className="relative mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-br from-kkpsi-gold/20 to-amber-100 dark:to-amber-900/30 p-6">
            <Trophy className="h-16 w-16 text-kkpsi-gold" />
          </div>
          <h2 className={`mb-2 font-serif text-3xl font-bold ${grade.color}`}>
            {grade.text}
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-6xl font-bold text-kkpsi-navy dark:text-kkpsi-navy-light">{percentage}</span>
            <span className="text-2xl font-medium text-muted-foreground">%</span>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-xl bg-green-50 dark:bg-green-950/30 p-4 ring-1 ring-green-100 dark:ring-green-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-red-50 dark:bg-red-950/30 p-4 ring-1 ring-red-100 dark:ring-red-900/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
          </div>
        </div>

        {/* Time Elapsed */}
        {timeElapsed !== undefined && (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-muted p-4 ring-1 ring-border">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-semibold text-foreground">{formatTime(timeElapsed)}</span>
            <span className="text-sm text-muted-foreground">total time</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Accuracy</span>
            <span className="text-muted-foreground">{correctAnswers} / {totalQuestions}</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Stats Row */}
        {timeElapsed !== undefined && avgTimePerQuestion !== undefined && (
          <div className="mb-6 grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-muted/50 p-3 ring-1 ring-border">
              <Clock className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{formatTime(timeElapsed)}</span>
              <span className="text-xs text-muted-foreground">Total Time</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-muted/50 p-3 ring-1 ring-border">
              <Timer className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{avgTimePerQuestion}s</span>
              <span className="text-xs text-muted-foreground">Avg/Question</span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-muted/50 p-3 ring-1 ring-border">
              <Target className="mb-1 h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{percentage}%</span>
              <span className="text-xs text-muted-foreground">Accuracy</span>
            </div>
          </div>
        )}

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

      {/* Question Breakdown Toggle */}
      {questions.length > 0 && (
        <div className="rounded-xl bg-card shadow-lg ring-1 ring-border">
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kkpsi-navy/10">
                <TrendingUp className="h-5 w-5 text-kkpsi-navy dark:text-kkpsi-navy-light" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Question Breakdown</h3>
                <p className="text-sm text-muted-foreground">
                  Review your answers and see what you got right
                </p>
              </div>
            </div>
            {showBreakdown ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          {showBreakdown && (
            <div className="border-t border-border p-4">
              <div className="space-y-3">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id];
                  const isCorrect = userAnswer === question.correctAnswer;
                  const wasAnswered = !!userAnswer;

                  return (
                    <div
                      key={question.id}
                      className={`rounded-xl p-4 ring-1 ${
                        isCorrect
                          ? "bg-green-50 ring-green-200 dark:bg-green-950/30 dark:ring-green-900/50"
                          : "bg-red-50 ring-red-200 dark:bg-red-950/30 dark:ring-red-900/50"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                              isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {question.question}
                          </p>
                        </div>
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                        )}
                      </div>

                      <div className="ml-10 space-y-2">
                        {!isCorrect && wasAnswered && (
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 text-xs font-medium text-red-600 dark:text-red-400">
                              Your answer:
                            </span>
                            <span className="text-sm text-red-700 dark:text-red-300 line-through">
                              {userAnswer}
                            </span>
                          </div>
                        )}
                        {!isCorrect && !wasAnswered && (
                          <div className="text-xs font-medium text-red-600 dark:text-red-400">
                            Not answered
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <span className="shrink-0 text-xs font-medium text-green-600 dark:text-green-400">
                            Correct answer:
                          </span>
                          <span className="text-sm text-green-700 dark:text-green-300">
                            {question.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Encouragement Card */}
      <div className="rounded-xl bg-gradient-to-br from-kkpsi-navy/5 to-kkpsi-gold/5 p-6 text-center ring-1 ring-border">
        <p className="text-foreground">
          {percentage >= 80
            ? "Outstanding performance! You really know your KKPsi knowledge."
            : percentage >= 60
              ? "Good effort! Review the material and try again to improve your score."
              : "Keep studying! Use the flashcards to reinforce your knowledge."}
        </p>
        {percentage < 80 && (
          <Button asChild variant="link" className="mt-2 text-kkpsi-navy dark:text-kkpsi-navy-light">
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
