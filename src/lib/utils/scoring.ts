/**
 * Scoring and grading utility functions
 */

export interface GradeInfo {
  text: string;
  color: string;
  bgColor: string;
  letter: string;
}

/**
 * Gets grade information based on a percentage score
 */
export function getGradeInfo(percentage: number): GradeInfo {
  if (percentage >= 90) {
    return {
      text: "Excellent!",
      color: "text-green-600",
      bgColor: "bg-green-100",
      letter: "A",
    };
  }
  if (percentage >= 80) {
    return {
      text: "Great Job!",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      letter: "B",
    };
  }
  if (percentage >= 70) {
    return {
      text: "Good Work!",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      letter: "C",
    };
  }
  if (percentage >= 60) {
    return {
      text: "Keep Practicing",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      letter: "D",
    };
  }
  return {
    text: "Keep Studying",
    color: "text-red-600",
    bgColor: "bg-red-100",
    letter: "F",
  };
}

/**
 * Calculates percentage from correct answers and total
 */
export function calculatePercentage(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Calculates score (0-100) from correct answers and total
 */
export function calculateScore(correct: number, total: number): number {
  if (total === 0) return 0;
  return (correct / total) * 100;
}

/**
 * Formats time in seconds to a human-readable string
 * e.g., 65 -> "1m 5s", 5 -> "5s"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

/**
 * Formats duration for longer time periods
 * e.g., 3665 -> "1h 1m"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) return `${hours}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
