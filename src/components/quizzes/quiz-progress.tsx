"use client";

import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";
import { Clock } from "lucide-react";

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

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Timer */}
      {isTimed && timeRemaining !== undefined && (
        <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-kkpsi-gold bg-kkpsi-gold/10 p-3">
          <Clock className={`h-5 w-5 ${timeRemaining <= 5 ? "text-red-500" : "text-kkpsi-navy"}`} />
          <span
            className={`text-2xl font-bold ${
              timeRemaining <= 5 ? "text-red-500" : "text-kkpsi-navy"
            }`}
          >
            {timeRemaining}s
          </span>
        </div>
      )}
    </div>
  );
}
