// src/domain/letter-flow/model/constants.ts
/**
 * Constants for Letter Flow game
 */

/** Number of color palette slots for letter coloring */
export const COLOR_PALETTE_COUNT = 24;

/** Default HSL saturation for colors */
export const DEFAULT_SATURATION = 72;

/** Default HSL lightness for colors */
export const DEFAULT_LIGHTNESS = 48;

/** Error level ID when loading fails */
export const ERROR_LEVEL_ID = 'error';

/** Default error level structure */
export const DEFAULT_ERROR_LEVEL = {
  id: ERROR_LEVEL_ID,
  difficulty: 'easy' as const,
  words: [],
  board: [],
  solution: '',
  endpoints: [],
};

/** Fallback colors for endpoints */
export const FALLBACK_COLORS = [
  'hsl(0, 72%, 48%)',    // Red
  'hsl(120, 72%, 48%)',  // Green
  'hsl(240, 72%, 48%)',  // Blue
  'hsl(60, 72%, 48%)',   // Yellow
  'hsl(300, 72%, 48%)',  // Magenta
  'hsl(180, 72%, 48%)',   // Cyan
];
