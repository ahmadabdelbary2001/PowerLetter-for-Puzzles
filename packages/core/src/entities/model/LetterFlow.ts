// src/domain/game/model/LetterFlow.ts
/**
 * Core domain types and constants for Letter Flow game
 */

import type { GameLevel, Difficulty } from '@core/shared/types/game';
import { ERROR_LEVEL_ID } from './shared';

/** Represents a single cell on the game board */
export interface BoardCell {
  x: number;
  y: number;
  letter: string;
  isUsed: boolean;
  color?: string;
}

/** Represents a path endpoint with position and letter */
export interface PathPoint {
  x: number;
  y: number;
  letter: string;
  color?: string;
}

/** A complete word path formed by connected cells */
export interface WordPath {
  word: string;
  cells: BoardCell[];
  startIndex: number;
}

/** Grid dimensions */
export interface GridSize {
  width: number;
  height: number;
}

/** Letter Flow level data - extends base GameLevel */
export interface LetterFlowLevel extends GameLevel {
  id: string;
  difficulty: Difficulty;
  words: string[];
  board: BoardCell[];
  solution: string;
  endpoints: PathPoint[];
}


/** Path validation result */
export interface PathValidationResult {
  isValid: boolean;
  error?: string;
  overlappingPaths?: WordPath[];
}

/** Game state for Letter Flow */
export interface LetterFlowGameState {
  board: BoardCell[];
  selectedPath: BoardCell[];
  foundWords: WordPath[];
  activeLetter: string | null;
  isComplete: boolean;
}


/** Constants */
export const COLOR_PALETTE_COUNT = 24;
export const DEFAULT_SATURATION = 72;
export const DEFAULT_LIGHTNESS = 48;
export const LETTER_FLOW_ERROR_LEVEL: LetterFlowLevel = {
  id: ERROR_LEVEL_ID,
  difficulty: 'easy',
  words: [],
  board: [],
  solution: '',
  endpoints: [],
};

export const FALLBACK_COLORS = [
  'hsl(0, 72%, 48%)',    // Red
  'hsl(120, 72%, 48%)',  // Green
  'hsl(240, 72%, 48%)',  // Blue
  'hsl(60, 72%, 48%)',   // Yellow
  'hsl(300, 72%, 48%)',  // Magenta
  'hsl(180, 72%, 48%)',   // Cyan
];
