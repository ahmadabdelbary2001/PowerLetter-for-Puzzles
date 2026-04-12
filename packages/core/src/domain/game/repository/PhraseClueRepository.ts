// src/domain/game/repository/PhraseClueRepository.ts
/**
 * Repository for loading Phrase Clue levels with Fetch strategy.
 */

import type { Language, GameCategory, Difficulty } from '@core/types/game';
import type { PhraseLevel, PhraseLevelData, PhraseLevelModule } from '../model/PhraseClue';
import { PHRASE_CLUE_DEFAULT_DIFFICULTY } from '../model/PhraseClue';
import { ERROR_LEVEL_ID } from '../model/shared';

const levelCache = new Map<string, PhraseLevel[]>();

export class PhraseClueRepository {
  async loadLevels(options: {
    language: Language;
    category: GameCategory;
    difficulty: Difficulty;
  }): Promise<PhraseLevel[]> {
    const { language, category, difficulty } = options;
    const cacheKey = `${language}-${category}-${difficulty}`;

    if (levelCache.has(cacheKey)) {
      return levelCache.get(cacheKey)!;
    }

    try {
      const basePath = typeof window !== 'undefined' ? window.location.origin : '';
      const dataUrl = `${basePath}/levels/${language}/phrase-clue/${category}/${difficulty}.json`;
      
      const response = await fetch(dataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch levels from ${dataUrl}`);
      }
      
      const module: PhraseLevelModule = await response.json();

      const levels = module.levels.map((data: PhraseLevelData): PhraseLevel => ({
        id: data.id,
        clue: data.clue,
        solution: data.solution,
        difficulty: data.difficulty ?? PHRASE_CLUE_DEFAULT_DIFFICULTY,
      }));

      levelCache.set(cacheKey, levels);
      return levels;
    } catch (error) {
      console.error(`[PhraseClueRepository] Error loading levels:`, error);
      
      if (category !== 'animals') {
        return this.loadLevels({ ...options, category: 'animals' });
      }
      
      return [];
    }
  }

  getCategories(_language: Language): string[] {
    return ['animals', 'geography', 'science', 'general'];
  }

  getDifficulties(_language: Language, _category: GameCategory): string[] {
    return ['easy', 'medium', 'hard'];
  }

  clearCache(): void {
    levelCache.clear();
  }

  createErrorLevel(): PhraseLevel {
    return {
      id: ERROR_LEVEL_ID,
      clue: 'Error loading level',
      solution: 'ERROR',
      difficulty: PHRASE_CLUE_DEFAULT_DIFFICULTY,
    };
  }
}

export const phraseClueRepository = new PhraseClueRepository();
