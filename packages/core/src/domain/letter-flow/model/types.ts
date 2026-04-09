// src/domain/letter-flow/model/types.ts
/**
 * Core domain types for Letter Flow game
 * Following FSD (Feature-Sliced Design) architecture
 */

import type { GameLevel, Difficulty, Language } from '../../../types/game';

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

/** Level loading options */
export interface LevelLoadOptions {
  language: Language;
  difficulty?: Difficulty;
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

/** Level module structure from JSON */
export interface LevelModule {
  default?: {
    levels?: unknown[];
    words?: unknown[];
    meta?: Record<string, unknown>;
  };
  levels?: unknown[];
}
