// src/games/engine/BaseGameEngine.ts
/**
 * @description The foundational abstract base class for all game engines.
 * It provides the universal, core logic for loading levels, including category
 * resolution and dynamic module importing. Subclasses must provide the specific
 * details for path construction and level validation.
 */
import type { Language, GameCategory, Difficulty, GameLevel } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import { GAME_REGISTRY } from '@/games/GameRegistry';
import type { IGameEngine } from './types';

// A generic interface for the structure of dynamically imported level modules.
interface LevelModule {
  default?: { levels?: unknown[] };
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
    const gameConfig = GAME_REGISTRY.find(game => game.id === gameId);
    const allAvailableCategories = gameConfig?.availableCategories?.filter(cat => cat !== 'general') ?? [];
    const categoriesToLoad = categories.includes('general') ? allAvailableCategories : categories;

    // Get all JSON modules from the data directory.
    const modules = import.meta.glob('/src/data/**/*.json') as Record<string, () => Promise<LevelModule>>;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        // Subclass provides the specific path to the module.
        const path = this.getModulePath(language, cat, difficulty);
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`${gameId} Engine: Module not found for path: ${path}`);
          return [];
        }

        const module = await moduleLoader();
        const rawLevels = module.default?.levels || module.levels || [];

        // Subclass provides the specific validation logic for each level.
        return rawLevels
          .map((lvl: unknown) => this.validateLevel(lvl, difficulty, cat))
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

  // --- Abstract Methods for Subclasses to Implement ---

  /** @returns The unique ID of the game (e.g., 'phrase-clue'). */
  protected abstract getGameId(): string;

  /** @returns The path to the JSON module for a given category and difficulty. */
  protected abstract getModulePath(language: Language, category: GameCategory, difficulty?: Difficulty): string;

  /** @returns A validated level object or null if the raw level data is invalid. */
  protected abstract validateLevel(levelData: unknown, difficulty?: Difficulty, category?: GameCategory): T | null;

  /** @returns A default error level object to be used when no levels can be loaded. */
  protected abstract getErrorLevel(): T;
}
