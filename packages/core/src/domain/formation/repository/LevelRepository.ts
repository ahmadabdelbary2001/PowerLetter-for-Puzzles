// src/domain/formation/repository/LevelRepository.ts
/**
 * Repository for loading Formation levels
 * Uses static imports to support both Vite and Webpack (Next.js)
 */

import type { Language, Difficulty } from '@/types/game';
import type { LevelLoadOptions } from '../model';

type LevelFile = { levels: unknown[] };

export class LevelRepository {
  /**
   * Load all levels for given options
   */
  async loadLevels(options: LevelLoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    
    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/formation/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        // Fallback to easy if specific difficulty fails
        if (difficulty !== 'easy') {
          return this.loadLevels({ ...options, difficulty: 'easy' });
        }
        throw new Error(`Failed to fetch ${dataUrl}`);
      }
      
      const file: LevelFile = await response.json();
      return file.levels || [];
    } catch (error) {
      console.error(`[LevelRepository] Error loading formation levels:`, error);
      return [];
    }
  }

  /**
   * Load level module (async for compatibility)
   */
  async loadModule(language: Language, difficulty: Difficulty = 'easy'): Promise<LevelFile> {
    const levels = await this.loadLevels({ language, difficulty });
    return { levels };
  }

  /** No-op: static imports need no cache */
  clearCache(): void {}
}

// Singleton instance
export const levelRepository = new LevelRepository();
