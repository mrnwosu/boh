"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface UseQuizTimerOptions {
  /** Whether the timer is enabled */
  enabled: boolean;
  /** Initial time in seconds */
  initialTime: number;
  /** Callback when time runs out */
  onTimeUp: () => void;
}

export interface UseQuizTimerReturn {
  /** Time remaining in seconds, undefined if not timed */
  timeRemaining: number | undefined;
  /** Reset the timer to initial time */
  resetTimer: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Resume the timer */
  resume: () => void;
  /** Whether the timer is currently paused */
  isPaused: boolean;
  /** Whether time has run out */
  isExpired: boolean;
}

/**
 * Hook for managing quiz timer functionality
 * Handles countdown, pause/resume, and time-up callbacks
 */
export function useQuizTimer({
  enabled,
  initialTime,
  onTimeUp,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState<number | undefined>(
    enabled ? initialTime : undefined
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Timer effect
  useEffect(() => {
    if (!enabled || timeRemaining === undefined || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === undefined || prev <= 1) {
          setIsExpired(true);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled, timeRemaining, isPaused]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(enabled ? initialTime : undefined);
    setIsExpired(false);
    setIsPaused(false);
  }, [enabled, initialTime]);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  return {
    timeRemaining,
    resetTimer,
    pause,
    resume,
    isPaused,
    isExpired,
  };
}
