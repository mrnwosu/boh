"use client";

import { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Flashcard } from "./flashcard";
import { SpacedRepetitionControls } from "./spaced-repetition-controls";

export interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  description?: string;
}

interface FlashcardDeckProps {
  questions: FlashcardData[];
  topic?: string;
  onRecordResponse?: (questionId: string, response: "again" | "hard" | "good" | "easy") => Promise<void>;
  isAuthenticated?: boolean;
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

export function FlashcardDeck({
  questions,
  onRecordResponse,
  isAuthenticated,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);

  // Shuffle questions on mount and when shuffleKey changes
  const shuffledQuestions = useMemo(
    () => shuffleArray(questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleKey]
  );

  const handleShuffle = useCallback(() => {
    setShuffleKey((prev) => prev + 1);
    setCurrentIndex(0);
  }, []);

  if (shuffledQuestions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">No flashcards available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentIndex]!;
  const progress = ((currentIndex + 1) / shuffledQuestions.length) * 100;

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
  };

  const handleResponse = async (response: "again" | "hard" | "good" | "easy") => {
    if (onRecordResponse) {
      await onRecordResponse(currentQuestion.id, response);
    }
    handleNext();
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Card {currentIndex + 1} of {shuffledQuestions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flashcard */}
      <Flashcard
        question={currentQuestion.question}
        answer={currentQuestion.answer}
        description={currentQuestion.description}
      />

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-1 px-3 sm:gap-2 sm:px-4"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>

        <div className="flex gap-1">
          <Button variant="ghost" onClick={handleReset} className="gap-1 px-3 sm:gap-2 sm:px-4">
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
          <Button variant="ghost" onClick={handleShuffle} className="gap-1 px-3 sm:gap-2 sm:px-4">
            <Shuffle className="h-4 w-4" />
            <span className="hidden sm:inline">Shuffle</span>
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === shuffledQuestions.length - 1}
          className="gap-1 px-3 sm:gap-2 sm:px-4"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Spaced Repetition Controls (only for authenticated users) */}
      {isAuthenticated && onRecordResponse && (
        <SpacedRepetitionControls
          onResponse={handleResponse}
          disabled={currentIndex === shuffledQuestions.length - 1 && !onRecordResponse}
        />
      )}

      {/* Guest Notice */}
      {!isAuthenticated && (
        <div className="rounded-lg border-2 border-kkpsi-gold bg-kkpsi-gold/10 p-4 text-center">
          <p className="text-sm text-foreground">
            Sign in to track your progress and use spaced repetition for efficient learning!
          </p>
        </div>
      )}
    </div>
  );
}
