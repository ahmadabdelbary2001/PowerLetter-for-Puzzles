// src/domain/game/repository/ImgChoiceRepository.ts
/**
 * Repository for loading Image Choice levels with Fetch strategy.
 */

import type { Language, GameCategory } from '@core/types/game';
import type { ImgChoiceLevel, ImgChoiceLevelData, ImgChoiceLevelModule } from '../model/ImgChoice';
import { ERROR_LEVEL_ID, ensureSolutionInOptions } from '../model/shared';

const levelCache = new Map<string, ImgChoiceLevel[]>();

export class ImgChoiceRepository {
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<ImgChoiceLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/img-choice/${category}/data.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: ImgChoiceLevelModule = await response.json();

      const levels = module.levels.map((data: ImgChoiceLevelData): ImgChoiceLevel => ({
        id: data.id,
        word: data.word,
        sound: data.sound,
        solution: data.solution,
        options: ensureSolutionInOptions(data.solution, data.options),
      }));

      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[ImgChoiceRepository] Error loading levels:`, error);
      
      if (category !== 'animals') {
        return this.loadLevels({ ...options, category: 'animals' });
      }
      return [];
    }
  }

  getCategories(language: Language): string[] {
    return ['animals', 'general'];
  }

  clearCache(): void {
    levelCache.clear();
  }

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

export const imgChoiceRepository = new ImgChoiceRepository();
