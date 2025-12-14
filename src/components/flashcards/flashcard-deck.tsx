"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
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

export function FlashcardDeck({
  questions,
  onRecordResponse,
  isAuthenticated,
}: FlashcardDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-600">No flashcards available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex]!;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
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
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Card {currentIndex + 1} of {questions.length}
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

        <Button variant="ghost" onClick={handleReset} className="gap-1 px-3 sm:gap-2 sm:px-4">
          <RotateCcw className="h-4 w-4" />
          <span className="hidden xs:inline">Reset</span>
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
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
          disabled={currentIndex === questions.length - 1 && !onRecordResponse}
        />
      )}

      {/* Guest Notice */}
      {!isAuthenticated && (
        <div className="rounded-lg border-2 border-kkpsi-gold bg-kkpsi-gold/10 p-4 text-center">
          <p className="text-sm text-gray-700">
            Sign in to track your progress and use spaced repetition for efficient learning!
          </p>
        </div>
      )}
    </div>
  );
}
