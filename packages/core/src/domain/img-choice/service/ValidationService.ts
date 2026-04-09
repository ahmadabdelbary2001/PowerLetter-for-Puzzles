// src/domain/img-choice/service/ValidationService.ts
/**
 * Service for validating Image Choice levels.
 */

import type { ImgChoiceLevel } from '../model';
import { ensureSolutionInOptions } from '../model';

/**
 * Service for validation logic
 */
export class ValidationService {
  /**
   * Check if level has required fields and valid structure
   */
  isValidLevel(level: unknown): level is ImgChoiceLevel {
    if (!level || typeof level !== 'object') return false;

    const l = level as Record<string, unknown>;
    return (
      typeof l.id === 'string' &&
      l.id.length > 0 &&
      typeof l.word === 'string' &&
      l.word.length > 0 &&
      typeof l.solution === 'string' &&
      l.solution.length > 0 &&
      Array.isArray(l.options) &&
      l.options.length > 0 &&
      l.options.includes(l.solution)
    );
  }

  /**
   * Validate all fields are present
   */
  hasAllFields(level: Partial<ImgChoiceLevel>): boolean {
    return !!(
      level.id &&
      level.word &&
      level.solution &&
      level.options &&
      level.options.length > 0
    );
  }

  /**
   * Ensure solution is in options
   */
  normalizeOptions(solution: string, options: string[]): string[] {
    return ensureSolutionInOptions(solution, options);
  }

  /**
   * Create error level when loading fails
   */
  createErrorLevel(): ImgChoiceLevel {
    return {
      id: 'error',
      word: 'Error',
      sound: '',
      solution: '/assets/images/error.png',
      options: ['/assets/images/error.png'],
    };
  }
}

// Singleton instance
export const validationService = new ValidationService();
