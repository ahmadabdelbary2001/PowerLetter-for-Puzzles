// src/domain/game/model/ImgClue.ts
/**
 * Core domain types and constants for Image Clue game
 */

import type { GameLevel } from '@core/types/game';

/** Image level extends GameLevel with image and sound */
export interface ImageLevel extends GameLevel {
  image: string;
  sound: string;
  solution: string;
}

/** Level data structure from JSON */
export interface ImgClueLevelData {
  id: string;
  image: string;
  sound: string;
  solution: string;
}

/** Level module structure */
export interface ImgClueLevelModule {
  levels: ImgClueLevelData[];
}


/** Validation result */
export interface ImgClueValidationResult {
  valid: boolean;
  error?: string;
}

/** Constants */
export const IMG_CLUE_ERROR_IMAGE = '/assets/images/error.png';
export const DEFAULT_LETTER_OPTIONS = 8;
export const KIDS_MODE_MULTIPLIER = 0.5;
export const MAX_SOLUTION_LENGTH = 15;
