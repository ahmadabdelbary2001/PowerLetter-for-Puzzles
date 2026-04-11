// src/domain/img-clue/repository/LevelRepository.ts
/**
 * Repository for loading Image Clue levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 */

import type { Language, GameCategory } from '@/types/game';
import type { ImageLevel, LevelData, LevelModule } from '../model';
import { ERROR_LEVEL_ID, ERROR_IMAGE_PATH } from '../model';

/** Cache for loaded levels */
const levelCache = new Map<string, ImageLevel[]>();

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

    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Determine directory name for the category
      // Mapping categories to their folder names in data/levels/...
      let folderName = category as string;
      if (category === 'fruits-and-vegetables') folderName = 'fruits-and-vegetables';
      
      const dataUrl = `${basePath}/levels/${language}/img-clue/${folderName}/data.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: LevelModule = await response.json();

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
    return ['animals', 'fruits-and-vegetables', 'shapes', 'general'];
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
