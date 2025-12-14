"use client";

import { Progress } from "~/components/ui/progress";
import { Clock, AlertTriangle } from "lucide-react";

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
  isTimed?: boolean;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  timeRemaining,
  isTimed = false,
}: QuizProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;
  const isLowTime = timeRemaining !== undefined && timeRemaining <= 5;

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/50">
      <div className="flex items-center gap-4">
        {/* Progress Section */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Timer */}
        {isTimed && timeRemaining !== undefined && (
          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              isLowTime
                ? "animate-pulse bg-red-100 text-red-600"
                : "bg-kkpsi-gold/10 text-kkpsi-navy"
            }`}
          >
            {isLowTime ? (
              <AlertTriangle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
            <span className="min-w-[3ch] text-center text-xl font-bold tabular-nums">
              {timeRemaining}
            </span>
            <span className="text-sm font-medium">sec</span>
          </div>
        )}
      </div>
    </div>
  );
}
