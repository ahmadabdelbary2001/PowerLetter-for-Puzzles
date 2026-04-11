// src/domain/phrase-clue/repository/LevelRepository.ts
/**
 * Repository for loading Phrase Clue levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory, Difficulty } from '@/types/game';
import type { PhraseLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, DEFAULT_DIFFICULTY } from '../model';

// ── Static imports: Webpack requires fully-static import paths ───────────────
import arAnimalsEasy from "@/data/levels/ar/phrase-clue/animals/easy.json";
import arAnimalsMedium from "@/data/levels/ar/phrase-clue/animals/medium.json";
import arAnimalsHard from "@/data/levels/ar/phrase-clue/animals/hard.json";
import arGeographyEasy from "@/data/levels/ar/phrase-clue/geography/easy.json";
import arGeographyMedium from "@/data/levels/ar/phrase-clue/geography/medium.json";
import arGeographyHard from "@/data/levels/ar/phrase-clue/geography/hard.json";
import arScienceEasy from "@/data/levels/ar/phrase-clue/science/easy.json";
import arScienceMedium from "@/data/levels/ar/phrase-clue/science/medium.json";
import arScienceHard from "@/data/levels/ar/phrase-clue/science/hard.json";

/** Cache for loaded levels */
const levelCache = new Map<string, PhraseLevel[]>();

/** Level lookup map by language-category-difficulty */
const levelMap: Record<string, Record<string, Record<string, LevelModule>>> = {
  ar: {
    animals: {
      easy: arAnimalsEasy as LevelModule,
      medium: arAnimalsMedium as LevelModule,
      hard: arAnimalsHard as LevelModule,
    },
    geography: {
      easy: arGeographyEasy as LevelModule,
      medium: arGeographyMedium as LevelModule,
      hard: arGeographyHard as LevelModule,
    },
    science: {
      easy: arScienceEasy as LevelModule,
      medium: arScienceMedium as LevelModule,
      hard: arScienceHard as LevelModule,
    },
    general: {
      easy: arAnimalsEasy as LevelModule,
      medium: arAnimalsMedium as LevelModule,
      hard: arAnimalsHard as LevelModule,
    },
  },
};

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

    // Get levels for the language
    const langLevels = levelMap[language] || levelMap['ar'];
    if (!langLevels) return [];

    // Resolve category with fallback
    const catLevels = langLevels[category] || langLevels['general'] || Object.values(langLevels)[0];
    if (!catLevels) {
      console.warn(`[LevelRepository] No levels found for category: ${category}`);
      return [];
    }

    // Resolve difficulty with fallback
    const module = catLevels[difficulty] || catLevels['easy'] || Object.values(catLevels)[0];
    if (!module) {
      console.warn(`[LevelRepository] No levels found for difficulty: ${difficulty}`);
      return [];
    }

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
   * Get all difficulties for a language and category
   */
  getDifficulties(language: Language, category: GameCategory): string[] {
    const langLevels = levelMap[language];
    if (!langLevels) return [];
    const catLevels = langLevels[category];
    if (!catLevels) return [];
    return Object.keys(catLevels);
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
