// src/domain/word-choice/repository/LevelRepository.ts
/**
 * Repository for loading Word Choice levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory } from '@/types/game';
import type { WordChoiceLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, ensureSolutionInOptions } from '../model';

/** Cache for loaded levels */
const levelCache = new Map<string, WordChoiceLevel[]>();

/**
 * Repository for Word Choice level operations
 */
export class LevelRepository {
  /**
   * Load levels for a given language and category
   */
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<WordChoiceLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

    // Check cache first
    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/word-choice/${category}/data.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: LevelModule = await response.json();

      // Convert to WordChoiceLevel array (ensure solution is in options)
      const levels = module.levels.map((data: LevelData): WordChoiceLevel => ({
        id: data.id,
        image: data.image,
        sound: data.sound,
        solution: data.solution,
        options: ensureSolutionInOptions(data.solution, data.options),
      }));

      // Cache and return
      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[LevelRepository] Error loading levels:`, error);
      
      // Fallback logic
      if (category !== 'animals') {
        return this.loadLevels({ ...options, category: 'animals' });
      }
      return [];
    }
  }

  /**
   * Get all categories for a language
   */
  getCategories(language: Language): string[] {
    return ['animals', 'general'];
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    levelCache.clear();
  }

  /**
   * Create an error level
   */
  createErrorLevel(): WordChoiceLevel {
    return {
      id: ERROR_LEVEL_ID,
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR',
      options: ['ERROR'],
    };
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
