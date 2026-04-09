// src/domain/outside-story/model/constants.ts
/**
 * @description Constants for Outside the Story game.
 */

import type { OutsiderLevel } from './types';

/** Minimum number of players required */
export const MIN_PLAYERS = 3;

/** Default number of words per round */
export const DEFAULT_WORD_COUNT = 8;

/** Points awarded for correct guess/identification */
export const POINTS_CORRECT = 10;

/** Error level for when loading fails */
export const ERROR_LEVEL: OutsiderLevel = {
  id: 'error',
  language: 'en',
  category: 'general',
  words: ['ERROR'],
  solution: 'ERROR',
};
