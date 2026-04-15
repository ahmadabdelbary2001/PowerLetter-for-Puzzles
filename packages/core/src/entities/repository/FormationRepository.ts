// src/domain/game/repository/FormationRepository.ts
/**
 * Repository for loading Formation levels with Fetch strategy.
 */

import type { Language, Difficulty } from '@core/shared/types/game';
import type { LevelLoadOptions } from '../model/shared';

type LevelFile = { levels: unknown[] };

export class FormationRepository {
  /**
   * Load all levels for given options
   */
  async loadLevels(options: LevelLoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    
    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/formation/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        if (difficulty !== 'easy') {
          return this.loadLevels({ ...options, difficulty: 'easy' });
        }
        throw new Error(`Failed to fetch ${dataUrl}`);
      }
      
      const file: LevelFile = await response.json();
      return file.levels || [];
    } catch (error) {
      console.error(`[FormationRepository] Error loading levels:`, error);
      return [];
    }
  }

  /**
   * Load level module
   */
  async loadModule(language: Language, difficulty: Difficulty = 'easy'): Promise<LevelFile> {
    const levels = await this.loadLevels({ language, difficulty });
    return { levels };
  }

  clearCache(): void {}
}

export const formationRepository = new FormationRepository();
