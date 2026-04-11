// src/domain/img-choice/repository/LevelRepository.ts
/**
 * Repository for loading Image Choice levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory } from '@/types/game';
import type { ImgChoiceLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, ensureSolutionInOptions } from '../model';

// ── Static imports: Webpack requires fully-static import paths ───────────────
import arAnimals from "@/data/levels/ar/img-choice/animals/data.json";

/** Cache for loaded levels */
const levelCache = new Map<string, ImgChoiceLevel[]>();

/** Level lookup map by language-category */
const levelMap: Record<string, Record<string, LevelModule>> = {
  ar: {
    animals: arAnimals as LevelModule,
    general: arAnimals as LevelModule, // fallback
  },
};

/**
 * Repository for Image Choice level operations
 */
export class LevelRepository {
  /**
   * Load levels for a given language and category
   */
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<ImgChoiceLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

    // Check cache first
    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    // Get levels for the language
    const langLevels = levelMap[language] || levelMap['ar'];
    if (!langLevels) return [];

    // Resolve category with fallback to 'animals' or the first available
    const module = langLevels[category] || langLevels['general'] || Object.values(langLevels)[0];
    if (!module) {
      console.warn(`[LevelRepository] No levels found for ${language}/${category}`);
      return [];
    }

    // Convert to ImgChoiceLevel array (ensure solution is in options)
    const levels = module.levels.map((data: LevelData): ImgChoiceLevel => ({
      id: data.id,
      word: data.word,
      sound: data.sound,
      solution: data.solution,
      options: ensureSolutionInOptions(data.solution, data.options),
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
  createErrorLevel(): ImgChoiceLevel {
    return {
      id: ERROR_LEVEL_ID,
      word: 'Error',
      sound: '',
      solution: '/assets/images/error.png',
      options: ['/assets/images/error.png'],
    };
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
