// src/domain/outside-story/repository/LevelRepository.ts
/**
 * @description Repository for loading Outside the Story levels.
 * Uses static imports for Webpack/Vite compatibility.
 */

import type { Language, GameCategory } from '@/types/game';
import type { OutsiderLevel, OutsiderLevelData } from '../model';
import { ERROR_LEVEL } from '../model';

// No static imports needed anymore, we use fetch() at runtime for API-Ready architecture.

/**
 * Level Repository - handles loading of outside-the-story categories
 */
export class LevelRepository {
  private cache: Map<string, OutsiderLevel[]> = new Map();

  /**
   * Load levels for given categories
   */
  async loadLevels(
    language: Language,
    categories: GameCategory[]
  ): Promise<OutsiderLevel[]> {
    const cacheKey = `${language}-${categories.join(',')}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results: OutsiderLevel[] = [];

    for (const cat of categories) {
      const level = await this.loadCategory(language, cat);
      if (level) {
        results.push(level);
      }
    }

    if (results.length === 0) {
      // Return ERROR_LEVEL instead of failing completely
      return [ERROR_LEVEL];
    }

    this.cache.set(cacheKey, results);
    return results;
  }

  /**
   * Load a single category
   */
  private async loadCategory(language: Language, category: GameCategory): Promise<OutsiderLevel | null> {
    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/outside-the-story/${category}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${dataUrl}`);
      }
      
      const data: OutsiderLevelData = await response.json();

      if (!data.words || data.words.length === 0) {
        console.warn(`Category ${category} has no words`);
        return null;
      }

      return {
        id: `${language}-${category}`,
        language,
        category,
        words: data.words.map(String),
        solution: data.words[0],
        meta: data.meta ?? {},
      };
    } catch (error) {
      console.error(`[LevelRepository] Error loading category ${category}:`, error);
      
      // Fallback to animals if possible
      if (category !== 'animals') {
        return this.loadCategory(language, 'animals');
      }
      
      return null;
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const levelRepository = new LevelRepository();
