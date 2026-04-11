// src/domain/game/service/WordChoiceValidationService.ts
/**
 * Service for validating Word Choice levels.
 */

import type { WordChoiceLevel } from '../model/WordChoice';
import { ensureSolutionInOptions } from '../model/shared';

export class WordChoiceValidationService {
  isValidLevel(level: unknown): level is WordChoiceLevel {
    if (!level || typeof level !== 'object') return false;
    const l = level as Record<string, unknown>;
    return (
      typeof l.id === 'string' &&
      l.id.length > 0 &&
      typeof l.image === 'string' &&
      l.image.length > 0 &&
      typeof l.solution === 'string' &&
      l.solution.length > 0 &&
      Array.isArray(l.options) &&
      l.options.length > 0 &&
      l.options.includes(l.solution)
    );
  }

  hasAllFields(level: Partial<WordChoiceLevel>): boolean {
    return !!(
      level.id &&
      level.image &&
      level.solution &&
      level.options &&
      level.options.length > 0
    );
  }

  normalizeOptions(solution: string, options: string[]): string[] {
    return ensureSolutionInOptions(solution, options);
  }

  createErrorLevel(): WordChoiceLevel {
    return {
      id: 'error',
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR',
      options: ['ERROR'],
    };
  }
}

export const wordChoiceValidationService = new WordChoiceValidationService();
