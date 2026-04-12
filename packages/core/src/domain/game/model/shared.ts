// src/domain/game/model/shared.ts
/**
 * Shared domain types and constants used across multiple games
 */

import type { Difficulty, Language } from '@core/types/game';

/** Level loading options */
export interface LevelLoadOptions {
  language: Language | string;
  difficulty?: Difficulty;
  category?: string;
}

/** Level module structure from JSON */
export interface LevelModule {
  levels?: any[];
}

/** Shared constants */
export const ERROR_LEVEL_ID = 'error';

/**
 * Ensure solution is in options array
 */
export function ensureSolutionInOptions(solution: string, options: string[]): string[] {
  const set = new Set(options);
  set.add(solution);
  return Array.from(set);
}
