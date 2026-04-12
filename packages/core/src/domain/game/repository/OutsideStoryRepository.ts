// src/domain/game/repository/OutsideStoryRepository.ts
/**
 * Repository for loading Outside the Story levels with Fetch strategy.
 */

import type { Language, GameCategory } from '@core/types/game';
import type { OutsiderLevel, OutsiderLevelData } from '../model/OutsideStory';
import { OUTSIDE_STORY_ERROR_LEVEL } from '../model/OutsideStory';

export class OutsideStoryRepository {
  private cache: Map<string, OutsiderLevel[]> = new Map();

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
      return [OUTSIDE_STORY_ERROR_LEVEL];
    }

    this.cache.set(cacheKey, results);
    return results;
  }

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
      console.error(`[OutsideStoryRepository] Error loading category ${category}:`, error);
      
      if (category !== 'animals') {
        return this.loadCategory(language, 'animals');
      }
      
      return null;
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const outsideStoryRepository = new OutsideStoryRepository();
