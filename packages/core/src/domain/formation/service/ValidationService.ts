// src/domain/formation/service/ValidationService.ts
/**
 * Service for level validation
 */

import type { FormationLevel } from '../model';
import { DEFAULT_ERROR_LEVEL } from '../model';

export class ValidationService {
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
    return { ...DEFAULT_ERROR_LEVEL };
  }
}

// Singleton instance
export const validationService = new ValidationService();
