// src/domain/game/service/PhraseClueValidationService.ts
/**
 * Service for validating Phrase Clue levels.
 */

import type { PhraseLevel } from '../model/PhraseClue';
import { getPointsByDifficulty } from '../model/PhraseClue';

export class PhraseClueValidationService {
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

  hasAllFields(level: Partial<PhraseLevel>): boolean {
    return !!(
      level.id &&
      level.clue &&
      level.solution &&
      level.difficulty
    );
  }

  getPoints(level: PhraseLevel): number {
    return getPointsByDifficulty(level.difficulty);
  }

  createErrorLevel(): PhraseLevel {
    return {
      id: 'error',
      clue: 'Error loading level',
      solution: 'ERROR',
      difficulty: 'easy',
    };
  }
}

export const phraseClueValidationService = new PhraseClueValidationService();
