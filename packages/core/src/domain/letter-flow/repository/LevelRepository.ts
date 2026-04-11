// src/domain/letter-flow/repository/LevelRepository.ts
/**
 * Repository for loading Letter Flow levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 * Dynamic import() with string templates breaks in Webpack — this is the fix.
 */

import type { Language, Difficulty, GameCategory } from '@/types/game';
import type { LevelModule } from '../model';

export interface LoadOptions {
  language: Language;
  category?: GameCategory;
  difficulty?: Difficulty;
}

export class LevelRepository {
  /**
   * Load level module for specific language and difficulty.
   */
  async loadModule(
    language: Language,
    difficulty: Difficulty = 'easy'
  ): Promise<LevelModule> {
    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/letter-flow/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        // Fallback to easy if specific difficulty fails
        if (difficulty !== 'easy') {
          return this.loadModule(language, 'easy');
        }
        throw new Error(`Failed to fetch ${dataUrl}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[LevelRepository] Error loading letter-flow module:`, error);
      return { levels: [] } as unknown as LevelModule;
    }
  }

  /**
   * Load all levels for given options.
   */
  async loadLevels(options: LoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    const module = await this.loadModule(language, difficulty);

    if (!module.levels || module.levels.length === 0) {
      console.warn(`LevelRepository: No levels found for ${language}/${difficulty}.`);
      return [];
    }

    return module.levels;
  }

  /** No-op: static imports need no cache management */
  clearCache(): void {}
}

// Singleton instance
export const levelRepository = new LevelRepository();
