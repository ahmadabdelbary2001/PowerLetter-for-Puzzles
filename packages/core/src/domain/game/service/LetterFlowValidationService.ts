// src/domain/game/service/LetterFlowValidationService.ts
/**
 * Service for Letter Flow level and solution validation
 */

import type { LetterFlowLevel, WordPath, PathPoint } from '../model/LetterFlow';
import { LETTER_FLOW_ERROR_LEVEL } from '../model/LetterFlow';

export class LetterFlowValidationService {
  /**
   * Check if level has required fields
   */
  isValidLevel(level: unknown): level is LetterFlowLevel {
    if (!level || typeof level !== 'object') return false;
    
    const l = level as Record<string, unknown>;
    return (
      'id' in l &&
      'solution' in l &&
      'endpoints' in l &&
      'gridSize' in l
    );
  }

  /**
   * Check if solution is complete
   */
  isSolutionComplete(foundPaths: WordPath[], solution: string): boolean {
    const allLetters = [...new Set(solution.split(''))];
    const connectedLetters = [...new Set(foundPaths.map(p => p.word))];
    return allLetters.every(letter => connectedLetters.includes(letter));
  }

  /**
   * Validate endpoints are correctly placed
   */
  validateEndpoints(endpoints: PathPoint[], boardWidth: number, boardHeight: number): boolean {
    const inBounds = endpoints.every(ep => 
      ep.x >= 0 && ep.x < boardWidth &&
      ep.y >= 0 && ep.y < boardHeight
    );
    
    if (!inBounds) return false;
    
    const letterCounts = new Map<string, number>();
    endpoints.forEach(ep => {
      letterCounts.set(ep.letter, (letterCounts.get(ep.letter) || 0) + 1);
    });
    
    return [...letterCounts.values()].every(count => count === 2);
  }

  /**
   * Create error level when loading fails
   */
  createErrorLevel(): LetterFlowLevel {
    return { ...LETTER_FLOW_ERROR_LEVEL };
  }
}

export const letterFlowValidationService = new LetterFlowValidationService();
