// src/domain/img-choice/model/types.ts
/**
 * TypeScript domain types for Image Choice game following FSD architecture.
 */

import type { GameLevel, Language, GameCategory } from '@/types/game';

/** Image choice level extends GameLevel with word prompt and image options */
export interface ImgChoiceLevel extends GameLevel {
  word: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level data structure from JSON */
export interface LevelData {
  id: string;
  word: string;
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
