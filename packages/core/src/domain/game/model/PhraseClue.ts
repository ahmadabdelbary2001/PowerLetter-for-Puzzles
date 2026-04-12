// src/domain/game/model/PhraseClue.ts
/**
 * Core domain types and constants for Phrase Clue game
 */

import type { GameLevel, Difficulty } from '@core/types/game';

/** Phrase level extends GameLevel with clue and difficulty */
export interface PhraseLevel extends GameLevel {
  clue: string;
  solution: string;
  difficulty: Difficulty;
}

/** Level data structure from JSON */
export interface PhraseLevelData {
  id: string;
  clue: string;
  solution: string;
  difficulty?: Difficulty;
}

/** Level module structure */
export interface PhraseLevelModule {
  levels: PhraseLevelData[];
}


/** Validation result */
export interface PhraseValidationResult {
  valid: boolean;
  error?: string;
}

/** Points configuration by difficulty */
export interface PointsConfig {
  easy: number;
  medium: number;
  hard: number;
}

/** Constants */
export const PHRASE_CLUE_DEFAULT_DIFFICULTY: Difficulty = 'easy';

export const POINTS_BY_DIFFICULTY = {
  easy: 10,
  medium: 20,
  hard: 30,
} as const;

export const PHRASE_CLUE_DEFAULT_LETTER_OPTIONS = 12;
export const PHRASE_CLUE_IS_KIDS_MODE = false;

/**
 * Get points for a difficulty level
 */
export function getPointsByDifficulty(difficulty: Difficulty): number {
  return POINTS_BY_DIFFICULTY[difficulty] ?? POINTS_BY_DIFFICULTY.easy;
}
