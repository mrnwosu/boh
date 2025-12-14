/**
 * Spaced Repetition - SM-2 Algorithm Implementation
 *
 * The SM-2 algorithm is used to calculate when a flashcard should be reviewed next
 * based on how well the user remembered it.
 *
 * Quality ratings (0-5):
 * 0 - Complete blackout
 * 1 - Incorrect response; correct answer recalled
 * 2 - Incorrect response; correct answer seemed easy to recall
 * 3 - Correct response with serious difficulty
 * 4 - Correct response after some hesitation
 * 5 - Perfect response
 */

export interface SM2Response {
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: Date;
}

/**
 * Calculate next review using SM-2 algorithm
 *
 * @param quality - User's quality rating (0-5)
 * @param currentEaseFactor - Current ease factor (default: 2.5)
 * @param currentInterval - Current interval in days (default: 0)
 * @param currentRepetitions - Current number of successful repetitions (default: 0)
 * @returns SM2Response with updated values
 */
export function calculateNextReview(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  currentEaseFactor = 2.5,
  currentInterval = 0,
  currentRepetitions = 0,
): SM2Response {
  let easeFactor = currentEaseFactor;
  let interval = currentInterval;
  let repetitions = currentRepetitions;

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)),
  );

  // If quality < 3, reset the learning process
  if (quality < 3) {
    repetitions = 0;
    interval = 1; // Review tomorrow
  } else {
    // Quality >= 3, successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions++;
  }

  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(0, 0, 0, 0); // Start of day

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview,
  };
}

/**
 * Determine flashcard status based on repetitions and ease factor
 */
export function determineStatus(
  repetitions: number,
  easeFactor: number,
): "NOT_STARTED" | "LEARNING" | "REVIEWING" | "MASTERED" {
  if (repetitions === 0) {
    return "NOT_STARTED";
  } else if (repetitions < 3) {
    return "LEARNING";
  } else if (easeFactor >= 2.5 && repetitions >= 5) {
    return "MASTERED";
  } else {
    return "REVIEWING";
  }
}

/**
 * Map simple user responses to quality ratings
 * For a simpler UX, we can map button clicks to quality ratings
 */
export function mapResponseToQuality(response: "again" | "hard" | "good" | "easy"): 0 | 1 | 2 | 3 | 4 | 5 {
  const mapping = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };
  return mapping[response] as 0 | 1 | 2 | 3 | 4 | 5;
}
