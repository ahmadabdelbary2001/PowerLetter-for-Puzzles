// src/domain/game/repository/WordChoiceRepository.ts
/**
 * Repository for loading Word Choice levels with Fetch strategy.
 */

import type { Language, GameCategory } from '@core/shared/types/game';
import type { WordChoiceLevel, WordChoiceLevelData, WordChoiceLevelModule } from '../model/WordChoice';
import { ERROR_LEVEL_ID, ensureSolutionInOptions } from '../model/shared';

const levelCache = new Map<string, WordChoiceLevel[]>();

export class WordChoiceRepository {
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<WordChoiceLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

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
      
      const module: WordChoiceLevelModule = await response.json();

      const levels = module.levels.map((data: WordChoiceLevelData): WordChoiceLevel => ({
        id: data.id,
        image: data.image,
        sound: data.sound,
        solution: data.solution,
        options: ensureSolutionInOptions(data.solution, data.options),
      }));

      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[WordChoiceRepository] Error loading levels:`, error);
      
      if (category !== 'animals') {
        return this.loadLevels({ ...options, category: 'animals' });
      }
      return [];
    }
  }

  getCategories(_language: Language): string[] {
    return ['animals', 'general'];
  }

  clearCache(): void {
    levelCache.clear();
  }

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

export const wordChoiceRepository = new WordChoiceRepository();
