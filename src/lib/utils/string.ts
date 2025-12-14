/**
 * String utility functions
 */

/**
 * Converts a slug to a human-readable title
 * e.g., "founding_fathers" -> "Founding Fathers"
 */
export function slugToTitle(slug: string, separator = "_"): string {
  return slug
    .split(separator)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converts a title to a URL-friendly slug
 * e.g., "Founding Fathers" -> "founding_fathers"
 */
export function titleToSlug(title: string, separator = "_"): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, separator)
    .replace(/[^\w_-]/g, "");
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Pluralizes a word based on count
 * e.g., pluralize(1, "card") -> "card", pluralize(2, "card") -> "cards"
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string
): string {
  if (count === 1) return singular;
  return plural ?? `${singular}s`;
}

/**
 * Formats a count with its label
 * e.g., formatCount(5, "question") -> "5 questions"
 */
export function formatCount(count: number, singular: string, plural?: string): string {
  return `${count} ${pluralize(count, singular, plural)}`;
}
