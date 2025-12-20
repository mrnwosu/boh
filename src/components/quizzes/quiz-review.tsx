"use client";

import { CheckCircle2, Circle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { QuizQuestion } from "~/types/trivia";

interface QuizReviewProps {
  questions: QuizQuestion[];
  answers: Record<string, string>;
  onQuestionClick: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function QuizReview({
  questions,
  answers,
  onQuestionClick,
  onSubmit,
  onBack,
  isSubmitting = false,
}: QuizReviewProps) {
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl bg-card p-6 shadow-xl ring-1 ring-border sm:p-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Review Your Answers
          </h2>
          <p className="text-muted-foreground">
            {allAnswered
              ? "All questions answered! Ready to submit?"
              : `${unansweredCount} question${unansweredCount !== 1 ? "s" : ""} remaining`}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl bg-green-50 dark:bg-green-950/30 p-4 ring-1 ring-green-100 dark:ring-green-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{answeredCount}</p>
              <p className="text-sm text-muted-foreground">Answered</p>
            </div>
          </div>
          <div className={`flex items-center gap-3 rounded-xl p-4 ring-1 ${
            unansweredCount > 0
              ? "bg-orange-50 dark:bg-orange-950/30 ring-orange-100 dark:ring-orange-900/50"
              : "bg-muted ring-border"
          }`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              unansweredCount > 0 ? "bg-orange-500" : "bg-muted-foreground/30"
            }`}>
              {unansweredCount > 0 ? (
                <AlertCircle className="h-5 w-5 text-white" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className={`text-xl font-bold ${unansweredCount > 0 ? "text-orange-600" : "text-muted-foreground"}`}>
                {unansweredCount}
              </p>
              <p className="text-sm text-muted-foreground">Unanswered</p>
            </div>
          </div>
        </div>

        {/* Question Grid */}
        <div className="mb-6">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Click a question to review or change your answer
          </h3>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => onQuestionClick(index)}
                  className={`group relative flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                    isAnswered
                      ? "bg-green-100 text-green-700 ring-1 ring-green-200 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-400 dark:ring-green-800 dark:hover:bg-green-900/50"
                      : "bg-orange-100 text-orange-700 ring-1 ring-orange-200 hover:bg-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:ring-orange-800 dark:hover:bg-orange-900/50"
                  }`}
                  aria-label={`Question ${index + 1}, ${isAnswered ? "answered" : "unanswered"}`}
                >
                  {index + 1}
                  {isAnswered && (
                    <CheckCircle2 className="absolute -right-1 -top-1 h-3.5 w-3.5 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question List Preview */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Question Preview</h3>
          <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg bg-muted/50 p-2">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              const selectedAnswer = answers[question.id];
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => onQuestionClick(index)}
                  className="flex w-full items-start gap-3 rounded-lg bg-card p-3 text-left ring-1 ring-border transition-all hover:ring-muted-foreground/30"
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                    isAnswered
                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-foreground">
                      {question.question}
                    </p>
                    {isAnswered && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        Your answer: {selectedAnswer}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-border sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2"
          disabled={isSubmitting}
        >
          Back to Questions
        </Button>

        <div className="flex items-center gap-3">
          {!allAnswered && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              {unansweredCount} unanswered
            </p>
          )}
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-kkpsi-navy shadow-lg shadow-kkpsi-navy/25 hover:bg-kkpsi-navy-light"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
            {!isSubmitting && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Warning for unanswered */}
      {!allAnswered && (
        <div className="rounded-xl bg-orange-50 dark:bg-orange-950/30 p-4 ring-1 ring-orange-100 dark:ring-orange-900/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <div>
              <p className="font-medium text-orange-700 dark:text-orange-400">
                You have unanswered questions
              </p>
              <p className="mt-1 text-sm text-orange-600 dark:text-orange-500">
                Unanswered questions will be marked as incorrect. Click on a question number above to answer it.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
