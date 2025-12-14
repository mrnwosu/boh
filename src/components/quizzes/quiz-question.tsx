"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import type { QuizQuestion } from "~/types/trivia";

interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: string) => void;
  showResult?: boolean;
  selectedAnswer?: string;
}

export function QuizQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  selectedAnswer,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer ?? null);

  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  const handleSelect = (answerId: string) => {
    if (showResult) return; // Don't allow changes after showing result
    setSelected(answerId);
    onAnswer(answerId);
  };

  const getOptionState = (option: string) => {
    if (!showResult) {
      return selected === option ? "selected" : "default";
    }
    if (option === question.correctAnswer) {
      return "correct";
    }
    if (selected === option && option !== question.correctAnswer) {
      return "incorrect";
    }
    return "default";
  };

  const optionStyles = {
    default: "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50",
    selected: "border-kkpsi-navy bg-kkpsi-navy/5 ring-2 ring-kkpsi-navy/20",
    correct: "border-green-500 bg-green-50",
    incorrect: "border-red-500 bg-red-50",
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-gray-200/50 sm:p-6 md:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center rounded-full bg-kkpsi-navy/5 px-3 py-1 text-sm font-medium text-kkpsi-navy">
          Question {questionNumber} of {totalQuestions}
        </div>
        <h2 className="font-serif text-lg font-bold text-gray-900 sm:text-xl md:text-2xl">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const state = getOptionState(option);
          const isSelected = selected === option;
          const letters = ["A", "B", "C", "D"];

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(option)}
              disabled={showResult}
              className={`group flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-all sm:gap-4 sm:p-4 ${optionStyles[state]} ${
                !showResult && !isSelected ? "cursor-pointer" : ""
              } ${showResult ? "cursor-default" : ""}`}
            >
              {/* Letter indicator */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors sm:h-9 sm:w-9 sm:text-base md:h-8 md:w-8 ${
                  state === "selected"
                    ? "bg-kkpsi-navy text-white"
                    : state === "correct"
                      ? "bg-green-500 text-white"
                      : state === "incorrect"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                }`}
              >
                {letters[idx]}
              </div>

              {/* Option text */}
              <span className="flex-1 pt-1 text-gray-700">{option}</span>

              {/* Result icon */}
              {showResult && state === "correct" && (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
              )}
              {showResult && state === "incorrect" && (
                <XCircle className="h-6 w-6 shrink-0 text-red-500" />
              )}
              {!showResult && isSelected && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-kkpsi-navy">
                  <Circle className="h-3 w-3 fill-white text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
