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
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200/50 sm:p-4">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Progress Section */}
        <div className="min-w-0 flex-1 space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-gray-700">
              <span className="hidden sm:inline">Question </span>
              <span className="sm:hidden">Q</span>
              {currentQuestion}/{totalQuestions}
            </span>
            <span className="text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 sm:h-2" />
        </div>

        {/* Timer */}
        {isTimed && timeRemaining !== undefined && (
          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors sm:gap-2 sm:px-4 sm:py-2 ${
              isLowTime
                ? "animate-pulse bg-red-100 text-red-600"
                : "bg-kkpsi-gold/10 text-kkpsi-navy"
            }`}
          >
            {isLowTime ? (
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
            <span className="min-w-[2ch] text-center text-base font-bold tabular-nums sm:min-w-[3ch] sm:text-xl">
              {timeRemaining}
            </span>
            <span className="hidden text-sm font-medium sm:inline">sec</span>
          </div>
        )}
      </div>
    </div>
  );
}
