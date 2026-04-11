// src/domain/game/service/ImgChoiceValidationService.ts
/**
 * Service for validating Image Choice levels.
 */

import type { ImgChoiceLevel } from '../model/ImgChoice';
import { ensureSolutionInOptions } from '../model/shared';

export class ImgChoiceValidationService {
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

  hasAllFields(level: Partial<ImgChoiceLevel>): boolean {
    return !!(
      level.id &&
      level.word &&
      level.solution &&
      level.options &&
      level.options.length > 0
    );
  }

  normalizeOptions(solution: string, options: string[]): string[] {
    return ensureSolutionInOptions(solution, options);
  }

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

export const imgChoiceValidationService = new ImgChoiceValidationService();
