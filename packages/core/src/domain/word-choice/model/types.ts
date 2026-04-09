// src/domain/word-choice/model/types.ts
/**
 * TypeScript domain types for Word Choice game following FSD architecture.
 */

import type { GameLevel, Language, GameCategory } from '../../../types/game';

/** Word choice level extends GameLevel with image and word options */
export interface WordChoiceLevel extends GameLevel {
  image: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level data structure from JSON */
export interface LevelData {
  id: string;
  image: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level module structure */
export interface LevelModule {
  levels: LevelData[];
}

/** Level load options */
export interface LevelLoadOptions {
  language: Language;
  category: GameCategory;
}

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}
