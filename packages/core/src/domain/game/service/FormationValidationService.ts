// src/domain/game/service/FormationValidationService.ts
/**
 * Service for Formation level validation
 */

import type { FormationLevel } from '../model/Formation';
import { FORMATION_ERROR_LEVEL } from '../model/Formation';

export class FormationValidationService {
  /**
   * Check if level has required fields
   */
  isValidLevel(level: unknown): level is FormationLevel {
    if (!level || typeof level !== 'object') return false;
    
    const l = level as Record<string, unknown>;
    return (
      'id' in l &&
      'words' in l &&
      Array.isArray(l.words) &&
      'grid' in l &&
      Array.isArray(l.grid) &&
      'baseLetters' in l
    );
  }

  /**
   * Create error level when loading fails
   */
  createErrorLevel(): FormationLevel {
    return { ...FORMATION_ERROR_LEVEL };
  }
}

export const formationValidationService = new FormationValidationService();
