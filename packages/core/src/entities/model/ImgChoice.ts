// src/domain/game/model/ImgChoice.ts
/**
 * Core domain types and constants for Image Choice game
 */

import type { GameLevel } from '@core/shared/types/game';

/** Image choice level extends GameLevel with word prompt and image options */
export interface ImgChoiceLevel extends GameLevel {
  word: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level data structure from JSON */
export interface ImgChoiceLevelData {
  id: string;
  word: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level module structure */
export interface ImgChoiceLevelModule {
  levels: ImgChoiceLevelData[];
}


/** Validation result */
export interface ImgChoiceValidationResult {
  valid: boolean;
  error?: string;
}

/** Constants */
export const IMG_CHOICE_ERROR_IMAGE = '/assets/images/error.png';
export const IMG_CHOICE_DEFAULT_OPTIONS_COUNT = 4;

