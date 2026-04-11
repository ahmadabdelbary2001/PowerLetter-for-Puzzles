// src/domain/phrase-clue/repository/LevelRepository.ts
/**
 * Repository for loading Phrase Clue levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory, Difficulty } from '@/types/game';
import type { PhraseLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, DEFAULT_DIFFICULTY } from '../model';

/** Cache for loaded levels */
const levelCache = new Map<string, PhraseLevel[]>();

/**
 * Repository for Phrase Clue level operations
 */
export class LevelRepository {
  /**
   * Load levels for a given language, category, and difficulty
   */
  async loadLevels(options: {
    language: Language;
    category: GameCategory;
    difficulty: Difficulty;
  }): Promise<PhraseLevel[]> {
    const { language, category, difficulty } = options;
    const cacheKey = `${language}-${category}-${difficulty}`;

    // Check cache first
    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      // Construction of path for dynamic fetching
      // This works in both dev (Vite) and prod (Tauri/Web) 
      // because copy-assets.js ensures data is in public/levels
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/phrase-clue/${category}/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: LevelModule = await response.json();

      // Convert to PhraseLevel array
      const levels = module.levels.map((data: LevelData): PhraseLevel => ({
        id: data.id,
        clue: data.clue,
        solution: data.solution,
        difficulty: data.difficulty ?? DEFAULT_DIFFICULTY,
      }));

      // Cache and return
      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[LevelRepository] Error loading levels:`, error);
      
      // Fallback logic if primary fetch fails (e.g. category 'general' not mapped to file)
      if (category !== 'animals') {
        console.warn(`[LevelRepository] Attempting fallback to 'animals' category`);
        return this.loadLevels({ ...options, category: 'animals' });
      }
      
      return [];
    }
  }

  /**
   * Get all categories for a language
   */
  getCategories(language: Language): string[] {
    // Return known categories for this game
    return ['animals', 'geography', 'science', 'general'];
  }

  /**
   * Get all difficulties for a language and category
   */
  getDifficulties(language: Language, category: GameCategory): string[] {
    // Return known difficulties
    return ['easy', 'medium', 'hard'];
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
  createErrorLevel(): PhraseLevel {
    return {
      id: ERROR_LEVEL_ID,
      clue: 'Error loading level',
      solution: 'ERROR',
      difficulty: DEFAULT_DIFFICULTY,
    };
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
