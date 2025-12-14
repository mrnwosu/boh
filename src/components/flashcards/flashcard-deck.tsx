"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Flashcard } from "./flashcard";
import { SpacedRepetitionControls } from "./spaced-repetition-controls";

// Minimum swipe distance to trigger navigation (in pixels)
const SWIPE_THRESHOLD = 50;

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
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Shuffle questions on mount and when shuffleKey changes
  const shuffledQuestions = useMemo(
    () => shuffleArray(questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleKey]
  );

  const handleShuffle = useCallback(() => {
    setShuffleKey((prev) => prev + 1);
    setIsFlipped(false);
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
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  const handleResponse = async (response: "again" | "hard" | "good" | "easy") => {
    if (onRecordResponse) {
      await onRecordResponse(currentQuestion.id, response);
    }
    handleNext();
  };

  // Touch event handlers for swipe navigation with animation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
    setSwipeOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || isAnimating) return;
    const currentX = e.touches[0]?.clientX ?? 0;
    const diff = currentX - touchStartX.current;
    // Limit the swipe offset for a more natural feel
    setSwipeOffset(diff * 0.5);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || isAnimating) return;

    const threshold = SWIPE_THRESHOLD;

    if (swipeOffset < -threshold && currentIndex < shuffledQuestions.length - 1) {
      // Swiped left -> animate out and go to next card
      setIsAnimating(true);
      setSwipeOffset(-300);
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(currentIndex + 1);
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 200);
    } else if (swipeOffset > threshold && currentIndex > 0) {
      // Swiped right -> animate out and go to previous card
      setIsAnimating(true);
      setSwipeOffset(300);
      setTimeout(() => {
        setIsFlipped(false);
        setCurrentIndex(currentIndex - 1);
        setSwipeOffset(0);
        setIsAnimating(false);
      }, 200);
    } else {
      // Snap back to center
      setSwipeOffset(0);
    }

    touchStartX.current = null;
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

      {/* Flashcard with swipe support */}
      <div
        className="touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.02}deg)`,
            opacity: isAnimating ? 0.5 : 1,
          }}
        >
          <Flashcard
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            description={currentQuestion.description}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
          />
        </div>
      </div>

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
