"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Flashcard } from "./flashcard";
import { SpacedRepetitionControls } from "./spaced-repetition-controls";
import type { TriviaQuestion } from "~/types/trivia";

interface FlashcardDeckProps {
  questions: TriviaQuestion[];
  onRecordResponse?: (questionId: string, quality: 0 | 1 | 2 | 3 | 4 | 5) => Promise<void>;
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

  const handleResponse = async (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (onRecordResponse) {
      await onRecordResponse(String(currentQuestion.id), quality);
    }
    handleNext();
  };

  // Get a random question version
  const questionText =
    currentQuestion.questionVersions[
      Math.floor(Math.random() * currentQuestion.questionVersions.length)
    ] ?? currentQuestion.questionVersions[0] ?? "";

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
      <Flashcard question={questionText} answer={currentQuestion.correctAnswer} />

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button variant="ghost" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
          className="gap-2"
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
