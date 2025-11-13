import { join, map, capitalize, split } from "lodash";

/**
 * Transform a snake_case or underscore-delimited string (or number) into a human readable
 * space separated, capitalized string.
 *
 * Example: `"favorite_color_demo" -> "Favorite Color Demo"`.
 * Numbers are coerced to strings before processing.
 * Returns an empty string when input is falsy.
 *
 * @param str The input value (string or number).
 * @returns Human readable, capitalized string.
 */
export function toReadableString(str?: string | number): string {
  if (!str) return "";
  return join(map(split(String(str), "_"), capitalize), " ");
}

/**
 * Build an Intl.Collator instance for case-insensitive (accent sensitive) comparison while preserving
 * numeric ordering (e.g., "item2" < "item10").
 *
 * @param language Optional BCP 47 language tag.
 * @returns Configured Intl.Collator.
 */
const caseInsensitiveCollator = (language: string | undefined) => new Intl.Collator(language, { sensitivity: "accent", numeric: true });

/**
 * Build an Intl.Collator instance for default (case sensitive) comparisons with numeric ordering.
 *
 * @param language Optional BCP 47 language tag.
 * @returns Configured Intl.Collator.
 */
const collator = (language: string | undefined) => new Intl.Collator(language, { numeric: true });

/**
 * Compare two strings using locale aware collation with numeric ordering.
 *
 * @param a First string.
 * @param b Second string.
 * @param language Optional locale.
 * @returns Negative/zero/positive per Intl.Collator.compare contract.
 */
export const stringCompare = (a: string, b: string, language: string | undefined = undefined): number => collator(language).compare(a, b);

/**
 * Case-insensitive (accent sensitive) locale aware comparison of two strings with numeric ordering.
 * Useful for sorting user-facing lists where case should not affect ordering.
 *
 * @param a First string.
 * @param b Second string.
 * @param language Optional locale.
 * @returns Negative/zero/positive per Intl.Collator.compare.
 */
export const caseInsensitiveStringCompare = (a: string, b: string, language: string | undefined = undefined): number =>
  caseInsensitiveCollator(language).compare(a, b);
