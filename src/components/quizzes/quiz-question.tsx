"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import type { QuizQuestion } from "~/types/trivia";

interface QuizQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answerId: string) => void;
  showResult?: boolean;
  selectedAnswer?: string;
  focusedIndex?: number;
  onFocusChange?: (index: number) => void;
}

export function QuizQuestionComponent({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  showResult = false,
  selectedAnswer,
  focusedIndex,
  onFocusChange,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<string | null>(selectedAnswer ?? null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [resultAnimation, setResultAnimation] = useState<Record<number, "correct" | "incorrect" | null>>({});
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setSelected(selectedAnswer ?? null);
  }, [selectedAnswer]);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (focusedIndex !== undefined && focusedIndex >= 0 && focusedIndex < question.options.length) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, question.options.length]);

  // Reset animations when question changes
  useEffect(() => {
    setAnimatingIndex(null);
    setResultAnimation({});
  }, [question.id]);

  const handleSelect = useCallback((answerId: string, index: number) => {
    if (showResult) return;

    // Trigger selection animation
    setAnimatingIndex(index);
    setTimeout(() => setAnimatingIndex(null), 300);

    setSelected(answerId);
    onAnswer(answerId);
  }, [showResult, onAnswer]);

  // Trigger result animations when showResult changes
  useEffect(() => {
    if (showResult && selected) {
      const newAnimations: Record<number, "correct" | "incorrect" | null> = {};
      question.options.forEach((option, idx) => {
        if (option === question.correctAnswer) {
          newAnimations[idx] = "correct";
        } else if (option === selected && option !== question.correctAnswer) {
          newAnimations[idx] = "incorrect";
        }
      });
      setResultAnimation(newAnimations);

      // Clear animations after they complete
      setTimeout(() => setResultAnimation({}), 500);
    }
  }, [showResult, selected, question.options, question.correctAnswer]);

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

  const getAnimationClass = (index: number, _state: string) => {
    if (animatingIndex === index) {
      return "animate-answer-select";
    }
    if (resultAnimation[index] === "correct") {
      return "animate-answer-correct";
    }
    if (resultAnimation[index] === "incorrect") {
      return "animate-answer-incorrect";
    }
    return "";
  };

  const optionStyles = {
    default: "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50",
    selected: "border-kkpsi-navy bg-kkpsi-navy/5 ring-2 ring-kkpsi-navy/20",
    correct: "border-green-500 bg-green-50 dark:bg-green-950/30",
    incorrect: "border-red-500 bg-red-50 dark:bg-red-950/30",
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="rounded-2xl bg-card p-4 shadow-xl ring-1 ring-border sm:p-6 md:p-8">
      {/* Question Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full bg-kkpsi-navy/5 dark:bg-kkpsi-navy/20 px-3 py-1 text-sm font-medium text-kkpsi-navy dark:text-kkpsi-navy-light">
            Question {questionNumber} of {totalQuestions}
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground sm:inline-flex">
            <span className="font-medium">Tip:</span> Press 1-4 or A-D to select
          </div>
        </div>
        <h2 className="font-serif text-lg font-bold text-foreground sm:text-xl md:text-2xl">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3" role="radiogroup" aria-label="Answer options">
        {question.options.map((option, idx) => {
          const state = getOptionState(option);
          const isSelected = selected === option;
          const isFocused = focusedIndex === idx;
          const animationClass = getAnimationClass(idx, state);

          return (
            <button
              key={idx}
              ref={(el) => { optionRefs.current[idx] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${letters[idx]}: ${option}`}
              onClick={() => handleSelect(option, idx)}
              onFocus={() => onFocusChange?.(idx)}
              disabled={showResult}
              className={`group flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left transition-all sm:gap-4 sm:p-4 ${optionStyles[state]} ${animationClass} ${
                !showResult && !isSelected ? "cursor-pointer" : ""
              } ${showResult ? "cursor-default" : ""} ${
                isFocused && !showResult ? "quiz-option-keyboard-focus" : ""
              } focus:outline-none focus-visible:quiz-option-keyboard-focus`}
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
                        : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                }`}
              >
                {letters[idx]}
              </div>

              {/* Option text */}
              <span className="flex-1 pt-1 text-foreground">{option}</span>

              {/* Result icon */}
              {showResult && state === "correct" && (
                <CheckCircle2 className={`h-6 w-6 shrink-0 text-green-500 ${resultAnimation[idx] === "correct" ? "animate-confetti-pop" : ""}`} />
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
