// src/domain/game/service/ImgClueValidationService.ts
/**
 * Service for validating Image Clue levels.
 */

import type { ImageLevel } from '../model/ImgClue';

export class ImgClueValidationService {
  isValidLevel(level: unknown): level is ImageLevel {
    if (!level || typeof level !== 'object') return false;
    const l = level as Record<string, unknown>;
    return (
      typeof l.id === 'string' &&
      l.id.length > 0 &&
      typeof l.image === 'string' &&
      l.image.length > 0 &&
      typeof l.sound === 'string' &&
      typeof l.solution === 'string' &&
      l.solution.length > 0
    );
  }

  hasAllFields(level: Partial<ImageLevel>): boolean {
    return !!(
      level.id &&
      level.image &&
      level.sound &&
      level.solution
    );
  }

  createErrorLevel(): ImageLevel {
    return {
      id: 'error',
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR',
    };
  }
}

export const imgClueValidationService = new ImgClueValidationService();
