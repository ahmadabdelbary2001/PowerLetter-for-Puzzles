// src/domain/game/model/WordChoice.ts
/**
 * Core domain types and constants for Word Choice game
 */

import type { GameLevel, Language, GameCategory } from '@core/types/game';
import { ERROR_LEVEL_ID } from './shared';
import type { LevelLoadOptions } from './shared';

/** Word choice level extends GameLevel with image and word options */
export interface WordChoiceLevel extends GameLevel {
  image: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level data structure from JSON */
export interface WordChoiceLevelData {
  id: string;
  image: string;
  sound: string;
  solution: string;
  options: string[];
}

/** Level module structure */
export interface WordChoiceLevelModule {
  levels: WordChoiceLevelData[];
}


/** Validation result */
export interface WordChoiceValidationResult {
  valid: boolean;
  error?: string;
}

/** Constants */
export const WORD_CHOICE_ERROR_IMAGE = '/assets/images/error.png';
export const WORD_CHOICE_DEFAULT_OPTIONS_COUNT = 4;

