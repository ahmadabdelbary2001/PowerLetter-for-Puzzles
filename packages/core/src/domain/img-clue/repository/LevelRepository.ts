// src/domain/img-clue/repository/LevelRepository.ts
/**
 * Repository for loading Image Clue levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory } from '../../../types/game';
import type { ImageLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, ERROR_IMAGE_PATH } from '../model';

// ── Static imports: Webpack requires fully-static import paths ───────────────
import arAnimals from '../../../data/ar/img-clue/animals/data.json';

/** Cache for loaded levels */
const levelCache = new Map<string, ImageLevel[]>();

/** Level lookup map by language-category */
const levelMap: Record<string, Record<string, LevelModule>> = {
  ar: {
    animals: arAnimals as LevelModule,
  },
};

/**
 * Repository for Image Clue level operations
 */
export class LevelRepository {
  /**
   * Load levels for a given language and category
   */
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<ImageLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

    // Check cache first
    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    // Get level module
    const langLevels = levelMap[language];
    if (!langLevels) {
      console.warn(`[LevelRepository] No levels for language: ${language}`);
      return [];
    }

    const module = langLevels[category];
    if (!module) {
      console.warn(`[LevelRepository] No levels for category: ${category}`);
      return [];
    }

    // Convert to ImageLevel array
    const levels = module.levels.map((data: LevelData): ImageLevel => ({
      id: data.id,
      image: data.image,
      sound: data.sound,
      solution: data.solution,
    }));

    // Cache and return
    levelCache.set(cacheKey, levels);
    return levels;
  }

  /**
   * Get all categories for a language
   */
  getCategories(language: Language): string[] {
    const langLevels = levelMap[language];
    if (!langLevels) return [];
    return Object.keys(langLevels);
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
  createErrorLevel(): ImageLevel {
    return {
      id: ERROR_LEVEL_ID,
      image: ERROR_IMAGE_PATH,
      sound: '',
      solution: 'ERROR',
    };
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
