// src/domain/game/repository/LetterFlowRepository.ts
/**
 * Repository for loading Letter Flow levels with Fetch strategy.
 */

import type { Language, Difficulty, GameCategory } from '@core/types/game';
import type { LevelModule } from '../model/shared';

export interface LoadOptions {
  language: Language;
  category?: GameCategory;
  difficulty?: Difficulty;
}

export class LetterFlowRepository {
  /**
   * Load level module for specific language and difficulty.
   */
  async loadModule(
    language: Language,
    difficulty: Difficulty = 'easy'
  ): Promise<LevelModule> {
    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/letter-flow/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        if (difficulty !== 'easy') {
          return this.loadModule(language, 'easy');
        }
        throw new Error(`Failed to fetch ${dataUrl}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`[LetterFlowRepository] Error loading module:`, error);
      return { levels: [] } as LevelModule;
    }
  }

  /**
   * Load all levels for given options.
   */
  async loadLevels(options: LoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    const module = await this.loadModule(language, difficulty);

    if (!module.levels || module.levels.length === 0) {
      console.warn(`LetterFlowRepository: No levels found for ${language}/${difficulty}.`);
      return [];
    }

    return module.levels;
  }

  clearCache(): void {}
}

export const letterFlowRepository = new LetterFlowRepository();
