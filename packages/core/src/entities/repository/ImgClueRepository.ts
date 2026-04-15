// src/domain/game/repository/ImgClueRepository.ts
/**
 * Repository for loading Image Clue levels with Fetch strategy.
 */

import type { Language, GameCategory } from '@core/shared/types/game';
import type { ImageLevel, ImgClueLevelData, ImgClueLevelModule } from '../model/ImgClue';
import { ERROR_LEVEL_ID } from '../model/shared';
import { IMG_CLUE_ERROR_IMAGE } from '../model/ImgClue';

const levelCache = new Map<string, ImageLevel[]>();

export class ImgClueRepository {
  async loadLevels(options: { language: Language; category: GameCategory }): Promise<ImageLevel[]> {
    const { language, category } = options;
    const cacheKey = `${language}-${category}`;

    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      let folderName = category as string;
      if (category === 'fruits-and-vegetables') folderName = 'fruits-and-vegetables';
      
      const dataUrl = `${basePath}/levels/${language}/img-clue/${folderName}/data.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: ImgClueLevelModule = await response.json();

      const levels = module.levels.map((data: ImgClueLevelData): ImageLevel => ({
        id: data.id,
        image: data.image,
        sound: data.sound,
        solution: data.solution,
      }));

      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[ImgClueRepository] Error loading levels:`, error);
      
      if (category !== 'animals') {
        return this.loadLevels({ ...options, category: 'animals' });
      }
      return [];
    }
  }

  getCategories(_language: Language): string[] {
    return ['animals', 'fruits-and-vegetables', 'shapes', 'general'];
  }

  clearCache(): void {
    levelCache.clear();
  }

  createErrorLevel(): ImageLevel {
    return {
      id: ERROR_LEVEL_ID,
      image: IMG_CLUE_ERROR_IMAGE,
      sound: '',
      solution: 'ERROR',
    };
  }
}

export const imgClueRepository = new ImgClueRepository();
