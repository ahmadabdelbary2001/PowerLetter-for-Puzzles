// src/domain/phrase-clue/service/ValidationService.ts
/**
 * Service for validating Phrase Clue levels.
 */

import type { PhraseLevel } from '../model';
import { getPointsByDifficulty } from '../model';

/**
 * Service for validation logic
 */
export class ValidationService {
  /**
   * Check if level has required fields
   */
  isValidLevel(level: unknown): level is PhraseLevel {
    if (!level || typeof level !== 'object') return false;

    const l = level as Record<string, unknown>;
    return (
      typeof l.id === 'string' &&
      l.id.length > 0 &&
      typeof l.clue === 'string' &&
      l.clue.length > 0 &&
      typeof l.solution === 'string' &&
      l.solution.length > 0 &&
      typeof l.difficulty === 'string'
    );
  }

  /**
   * Validate all fields are present
   */
  hasAllFields(level: Partial<PhraseLevel>): boolean {
    return !!(
      level.id &&
      level.clue &&
      level.solution &&
      level.difficulty
    );
  }

  /**
   * Get points for a level based on difficulty
   */
  getPoints(level: PhraseLevel): number {
    return getPointsByDifficulty(level.difficulty);
  }

  /**
   * Create error level when loading fails
   */
  createErrorLevel(): PhraseLevel {
    return {
      id: 'error',
      clue: 'Error loading level',
      solution: 'ERROR',
      difficulty: 'easy',
    };
  }
}

// Singleton instance
export const validationService = new ValidationService();
