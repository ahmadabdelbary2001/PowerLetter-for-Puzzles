// src/domain/game/service/LetterFlowPathService.ts
/**
 * Service for Letter Flow path-related operations
 */

import type { BoardCell, WordPath, PathPoint } from '../model/LetterFlow';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  overlappingPaths?: WordPath[];
}

export class LetterFlowPathService {
  /**
   * Check if two cells are adjacent (4-directional)
   */
  isAdjacent(cell1: BoardCell, cell2: BoardCell): boolean {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }

  /**
   * Check if a path is continuous
   */
  isPathContinuous(path: BoardCell[]): boolean {
    if (path.length < 2) return true;
    
    for (let i = 1; i < path.length; i++) {
      if (!this.isAdjacent(path[i - 1], path[i])) {
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a cell is an endpoint
   */
  isEndpoint(cell: BoardCell, endpoints: PathPoint[]): boolean {
    return endpoints.some(ep => 
      ep.x === cell.x && ep.y === cell.y && ep.letter === cell.letter
    );
  }

  /**
   * Check if path forms valid word (start and end are endpoints with same letter)
   */
  isValidWordPath(path: BoardCell[], endpoints: PathPoint[]): boolean {
    if (path.length < 2) return false;
    
    const start = path[0];
    const end = path[path.length - 1];
    
    if (!this.isEndpoint(start, endpoints) || !this.isEndpoint(end, endpoints)) {
      return false;
    }
    
    return start.letter === end.letter;
  }

  /**
   * Get the letter for a completed path
   */
  getPathLetter(path: BoardCell[], endpoints: PathPoint[]): string | null {
    if (path.length === 0) return null;
    
    const start = path[0];
    const endpoint = endpoints.find(ep => 
      ep.x === start.x && ep.y === start.y
    );
    
    return endpoint?.letter || null;
  }

  /**
   * Check if two paths overlap
   */
  pathsOverlap(path1: BoardCell[], path2: BoardCell[]): boolean {
    return path1.some(cell1 => 
      path2.some(cell2 => cell1.x === cell2.x && cell1.y === cell2.y)
    );
  }

  /**
   * Find all paths that overlap with a given path
   */
  findOverlappingPaths(path: BoardCell[], existingPaths: WordPath[]): WordPath[] {
    return existingPaths.filter(wp => this.pathsOverlap(path, wp.cells));
  }

  /**
   * Validate a new path being created
   */
  validateNewPath(
    path: BoardCell[],
    endpoints: PathPoint[],
    existingPaths: WordPath[]
  ): ValidationResult {
    if (!this.isPathContinuous(path)) {
      return { isValid: false, error: 'pathNotContinuous' };
    }

    if (!this.isValidWordPath(path, endpoints)) {
      return { isValid: false, error: 'invalidEndpoint' };
    }

    const overlapping = this.findOverlappingPaths(path, existingPaths);
    
    return {
      isValid: true,
      overlappingPaths: overlapping.length > 0 ? overlapping : undefined,
    };
  }
}

export const letterFlowPathService = new LetterFlowPathService();
