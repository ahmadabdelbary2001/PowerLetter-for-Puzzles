// src/domain/formation/model/types.ts
/**
 * Core domain types for Formation (Word Crossword) game
 * Following FSD (Feature-Sliced Design) architecture
 */

import type { GameLevel, Difficulty } from '../../../types/game';

/** A single cell in the crossword grid */
export interface GridCell {
  x: number;
  y: number;
  letter: string;
  words: number[]; // indices of words this cell belongs to
}

/** Word placement direction */
export type Direction = 'horizontal' | 'vertical';

/** A word placement on the grid */
export interface WordPlacement {
  word: string;
  startX: number;
  startY: number;
  direction: Direction;
}

/** Complete formation level */
export interface FormationLevel extends GameLevel {
  id: string;
  difficulty: Difficulty;
  words: string[];
  grid: GridCell[];
  baseLetters: string;
  solution: string;
}

/** Level loading options */
export interface LevelLoadOptions {
  language: string;
  difficulty?: Difficulty;
}

/** Validation result for a word attempt */
export interface WordValidationResult {
  isValid: boolean;
  error?: 'wordNotFound' | 'lettersNotAvailable' | 'alreadyFound';
}

/** Game state for Formation */
export interface FormationGameState {
  letters: string[];
  currentInput: string;
  foundWords: Set<string>;
  revealedCells: Set<string>; // "x,y" format
  usedLetterIndices: number[];
  isComplete: boolean;
}
