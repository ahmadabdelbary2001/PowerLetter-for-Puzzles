// src/domain/game/service/FormationGridService.ts
/**
 * Service for Formation grid operations
 */

import type { GridCell, FormationLevel } from '../model/Formation';

export class FormationGridService {
  /**
   * Get grid dimensions
   */
  getGridSize(grid: GridCell[]): { width: number; height: number } {
    if (grid.length === 0) return { width: 0, height: 0 };
    
    const maxX = Math.max(...grid.map(c => c.x));
    const maxY = Math.max(...grid.map(c => c.y));
    
    return { width: maxX + 1, height: maxY + 1 };
  }

  /**
   * Find cell at position
   */
  findCell(grid: GridCell[], x: number, y: number): GridCell | undefined {
    return grid.find(c => c.x === x && c.y === y);
  }

  /**
   * Get revealed cells for found words
   */
  getRevealedCells(foundWords: Set<string>, level: FormationLevel): Set<string> {
    const revealed = new Set<string>();
    const foundArray = Array.from(foundWords).map(w => w.toLowerCase());

    for (const cell of level.grid) {
      for (const wordIdx of cell.words) {
        const word = level.words[wordIdx];
        if (word && foundArray.includes(word.toLowerCase())) {
          revealed.add(`${cell.x},${cell.y}`);
        }
      }
    }

    return revealed;
  }

  /**
   * Check if all words have been found
   */
  isComplete(foundWords: Set<string>, level: FormationLevel): boolean {
    if (foundWords.size !== level.words.length) return false;
    
    const foundNormalized = new Set(Array.from(foundWords).map(w => w.toLowerCase()));
    return level.words.every(w => foundNormalized.has(w.toLowerCase()));
  }
}

export const formationGridService = new FormationGridService();
