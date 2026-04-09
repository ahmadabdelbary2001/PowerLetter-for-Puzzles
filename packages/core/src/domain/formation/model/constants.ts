// src/domain/formation/model/constants.ts
/**
 * Constants for Formation game
 */

/** Error level ID when loading fails */
export const ERROR_LEVEL_ID = 'error';

/** Default error level structure */
export const DEFAULT_ERROR_LEVEL: {
  id: string;
  difficulty: 'easy';
  words: string[];
  grid: never[];
  baseLetters: string;
  solution: string;
} = {
  id: ERROR_LEVEL_ID,
  difficulty: 'easy',
  words: [],
  grid: [],
  baseLetters: 'ERROR',
  solution: '',
};
