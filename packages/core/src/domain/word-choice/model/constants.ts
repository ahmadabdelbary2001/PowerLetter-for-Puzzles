// src/domain/word-choice/model/constants.ts
/**
 * Constants for Word Choice game.
 */

/** Default error level ID */
export const ERROR_LEVEL_ID = 'error';

/** Default error image path */
export const ERROR_IMAGE_PATH = '/assets/images/error.png';

/** Default number of options */
export const DEFAULT_OPTIONS_COUNT = 4;

/**
 * Ensure solution is in options array
 */
export function ensureSolutionInOptions(solution: string, options: string[]): string[] {
  const set = new Set(options);
  set.add(solution);
  return Array.from(set);
}
