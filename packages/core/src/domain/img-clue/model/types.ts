// src/domain/img-clue/model/types.ts
/**
 * TypeScript domain types for Image Clue game following FSD architecture.
 */

import type { GameLevel, Language, GameCategory } from '../../../types/game';

/** Image level extends GameLevel with image and sound */
export interface ImageLevel extends GameLevel {
  image: string;
  sound: string;
  solution: string;
}

/** Level data structure from JSON */
export interface LevelData {
  id: string;
  image: string;
  sound: string;
  solution: string;
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
