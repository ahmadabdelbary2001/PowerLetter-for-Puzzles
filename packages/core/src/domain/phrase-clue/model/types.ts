// src/domain/phrase-clue/model/types.ts
/**
 * TypeScript domain types for Phrase Clue game following FSD architecture.
 */

import type { GameLevel, Language, GameCategory, Difficulty } from '../../../types/game';

/** Phrase level extends GameLevel with clue and difficulty */
export interface PhraseLevel extends GameLevel {
  clue: string;
  solution: string;
  difficulty: Difficulty;
}

/** Level data structure from JSON */
export interface LevelData {
  id: string;
  clue: string;
  solution: string;
  difficulty?: Difficulty;
}

/** Level module structure */
export interface LevelModule {
  levels: LevelData[];
}

/** Level load options */
export interface LevelLoadOptions {
  language: Language;
  category: GameCategory;
  difficulty: Difficulty;
}

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/** Points configuration by difficulty */
export interface PointsConfig {
  easy: number;
  medium: number;
  hard: number;
}
