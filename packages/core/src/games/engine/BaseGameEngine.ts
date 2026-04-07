// src/games/engine/BaseGameEngine.ts
/**
 * @description The foundational abstract base class for all game engines.
 * It provides the universal, core logic for loading levels, including category
 * resolution and dynamic module importing. Subclasses must provide the specific
 * details for path construction and level validation.
 */
import type { Language, GameCategory, Difficulty, GameLevel } from '@powerletter/core';
import { GAME_METADATA } from '@powerletter/core';
import { shuffleArray } from '../../lib/gameUtils';
import type { IGameEngine } from './types';

// A generic interface for the structure of dynamically imported level modules.
export interface LevelModule {
  default?: {
    levels?: unknown[];
    words?: unknown[];
    meta?: Record<string, unknown>;
  };
  levels?: unknown[];
}

export abstract class BaseGameEngine<T extends GameLevel> implements IGameEngine<T> {
  /**
   * @description The main, shared level-loading function. It orchestrates the
   * entire process by iterating over categories and calling abstract methods
   * that subclasses are required to implement.
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<T[]> {
    const { language, categories, difficulty } = options;
    const gameId = this.getGameId();
    // Resolve categories: if 'general' is selected, get all available categories for this game.
    const gameConfig = GAME_METADATA.find(game => game.id === gameId);
    const allAvailableCategories = gameConfig?.availableCategories?.filter(cat => cat !== 'general') ?? [];
    const categoriesToLoad = categories.includes('general') ? allAvailableCategories : categories;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const module = await this.safeLoadModule(language, cat, difficulty);
        
        const rawLevels = module.default?.levels || module.levels || [];

        // Subclass provides the specific validation logic for each level.
        return rawLevels
          .map((lvl: unknown) => this.validateLevel(lvl, difficulty ?? 'easy', cat))
          .filter((l): l is T => l !== null);
      } catch (err) {
        console.error(`${gameId} Engine: Failed to load levels for ${language}/${cat}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      // Subclass provides the specific error level to return.
      return [this.getErrorLevel()];
    }

    return shuffleArray(allLevels);
  }

  /**
   * @description A helper method that attempts to load a module for a specific difficulty,
   * falling back to 'easy' if the requested difficulty is not available.
   */
  protected async safeLoadModule(language: Language, category: GameCategory, difficulty?: Difficulty): Promise<LevelModule> {
    try {
      return await this.loadModule(language, category, difficulty);
    } catch (loadErr) {
      if (difficulty && difficulty !== 'easy') {
        console.warn(`${this.getGameId()} Engine: Failed to load ${difficulty} difficulty for ${category}. Falling back to easy.`);
        return await this.loadModule(language, category, 'easy');
      }
      throw loadErr;
    }
  }

  // --- Abstract Methods for Subclasses to Implement ---

  /** @returns The unique ID of the game (e.g., 'phrase-clue'). */
  protected abstract getGameId(): string;

  /** @returns A Promise containing the dynamically imported level module */
  protected abstract loadModule(language: Language, category: GameCategory, difficulty?: Difficulty): Promise<LevelModule>;

  /** @returns A validated level object or null if the raw level data is invalid. */
  protected abstract validateLevel(levelData: unknown, difficulty?: Difficulty, category?: GameCategory): T | null;

  /** @returns A default error level object to be used when no levels can be loaded. */
  protected abstract getErrorLevel(): T;
}
