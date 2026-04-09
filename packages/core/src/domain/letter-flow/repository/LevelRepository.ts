// src/domain/letter-flow/repository/LevelRepository.ts
/**
 * Repository for loading Letter Flow levels
 * Handles data access with caching and fallback logic
 */

import type { Language, Difficulty, GameCategory } from '../../../types/game';
import type { LetterFlowLevel, LevelModule } from '../model';
import { DEFAULT_ERROR_LEVEL } from '../model';

export interface LoadOptions {
  language: Language;
  category?: GameCategory;
  difficulty?: Difficulty;
}

/** Cache for loaded level modules */
const levelCache = new Map<string, LevelModule>();

export class LevelRepository {
  private getCacheKey(language: Language, difficulty: Difficulty): string {
    return `letter-flow:${language}:${difficulty}`;
  }

  /**
   * Load level module for specific language and difficulty
   * Falls back to 'easy' if requested difficulty not found
   */
  async loadModule(
    language: Language,
    difficulty: Difficulty = 'easy'
  ): Promise<LevelModule> {
    const cacheKey = this.getCacheKey(language, difficulty);
    
    // Check cache
    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      // Dynamic import of JSON level data
      const module = await import(`../../../data/${language}/letter-flow/${difficulty}.json`);
      levelCache.set(cacheKey, module);
      return module;
    } catch (error) {
      // Fallback to easy difficulty
      if (difficulty !== 'easy') {
        console.warn(`Failed to load ${difficulty} difficulty, falling back to easy`);
        return this.loadModule(language, 'easy');
      }
      throw error;
    }
  }

  /**
   * Load all levels for given options
   */
  async loadLevels(options: LoadOptions): Promise<unknown[]> {
    const { language, difficulty } = options;
    
    try {
      const module = await this.loadModule(language, difficulty);
      return module.default?.levels || module.levels || [];
    } catch (error) {
      console.error(`Failed to load levels for ${language}/${difficulty}:`, error);
      return [];
    }
  }

  /** Clear cache */
  clearCache(): void {
    levelCache.clear();
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
