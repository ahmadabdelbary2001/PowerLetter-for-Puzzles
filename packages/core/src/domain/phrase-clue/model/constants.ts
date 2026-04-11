// src/domain/phrase-clue/model/constants.ts
/**
 * Constants for Phrase Clue game.
 */

import type { Difficulty } from '@/types/game';

/** Default error level ID */
export const ERROR_LEVEL_ID = 'error';

/** Default difficulty */
export const DEFAULT_DIFFICULTY: Difficulty = 'easy';

/** Points by difficulty */
export const POINTS_BY_DIFFICULTY = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

/** Default letter options count */
export const DEFAULT_LETTER_OPTIONS = 12;

/** Kids mode flag (phrase clue is not kids mode by default) */
export const IS_KIDS_MODE = false;

/**
 * Get points for a difficulty level
 */
export function getPointsByDifficulty(difficulty: Difficulty): number {
  return POINTS_BY_DIFFICULTY[difficulty] ?? POINTS_BY_DIFFICULTY.easy;
}
