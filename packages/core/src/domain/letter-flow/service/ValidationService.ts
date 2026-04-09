// src/domain/letter-flow/service/ValidationService.ts
/**
 * Service for level and solution validation
 */

import type { LetterFlowLevel, WordPath, PathPoint } from '../model';

export class ValidationService {
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
    // Extract all unique letters from solution
    const allLetters = [...new Set(solution.split(''))];
    
    // Get connected letters from found paths
    const connectedLetters = [...new Set(foundPaths.map(p => p.word))];
    
    // Check if all letters are connected
    return allLetters.every(letter => connectedLetters.includes(letter));
  }

  /**
   * Validate endpoints are correctly placed
   */
  validateEndpoints(endpoints: PathPoint[], boardWidth: number, boardHeight: number): boolean {
    // Check all endpoints are within bounds
    const inBounds = endpoints.every(ep => 
      ep.x >= 0 && ep.x < boardWidth &&
      ep.y >= 0 && ep.y < boardHeight
    );
    
    if (!inBounds) return false;
    
    // Check each letter appears exactly twice (start and end)
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
    return {
      id: 'error',
      difficulty: 'easy',
      words: [],
      board: [],
      solution: '',
      endpoints: [],
    };
  }
}

// Singleton instance
export const validationService = new ValidationService();
