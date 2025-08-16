import _ from 'lodash';

/**
 * Convert a full name into initials.
 * Examples:
 *   'Dimas Bagus P' -> 'DP'
 *   'john doe' -> 'JD'
 *   'Madonna' -> 'MA' (first two letters)
 *
 * @param name - Full name string
 * @param maxSingleWord - How many characters to use for a single-word name (default 2)
 * @returns Uppercase initials
 */
export function nameToInitials(name: string, maxSingleWord = 2): string {
  if (!name) return '';
  const cleaned = _.deburr(String(name)).trim();
  if (cleaned.length === 0) return '';

  const words = _.words(cleaned);
  if (words.length === 0) return '';

  if (words.length === 1) {
    const w = words[0];
    return w.slice(0, Math.min(maxSingleWord, w.length)).toUpperCase();
  }

  const first = _.head(words) ?? '';
  const last = _.last(words) ?? '';
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}
