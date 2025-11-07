// src/games/engine/ClueGameEngine.ts
/**
 * @description An abstract base class for "clue-style" game engines.
 * It provides all the common logic for loading levels from JSON files,
 * including category resolution, dynamic module importing, and level validation.
 * Subclasses only need to provide their specific implementation details.
 */
import type { Language, GameCategory, Difficulty, GameLevel } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils';
import { GAME_REGISTRY } from '@/games/GameRegistry';
import type { IGameEngine } from './types';

/**
 * @interface ClueLevel
 * @description Defines the base structure for any level in a clue-based game.
 */
export interface ClueLevel extends GameLevel {
  solution: string;
}

// Interface for the module structure returned when dynamically importing JSON level files
interface LevelModule {
  default?: { levels?: unknown[] };
  levels?: unknown[];
}

// The abstract base class containing the shared logic
export abstract class ClueGameEngine<T extends ClueLevel> implements IGameEngine<T> {
  /**
   * @description The main level loading function. This is the shared logic.
   * It orchestrates the loading process by calling abstract methods that subclasses must implement.
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
        // Construct the path using the details provided by the subclass.
        const path = this.getModulePath(language, cat, difficulty);
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`${gameId} Engine: Module not found for path: ${path}`);
          return [];
        }

        const module = await moduleLoader();
        const rawLevels = module.default?.levels || module.levels || [];

        // Validate each level using the logic provided by the subclass.
        return rawLevels
          .map((lvl: unknown) => this.validateLevel(lvl, difficulty))
          .filter((l): l is T => l !== null);
      } catch (err) {
        console.error(`${gameId} Engine: Failed to load levels for ${language}/${cat}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      // Return a game-specific error level.
      return [this.getErrorLevel()];
    }

    return shuffleArray(allLevels);
  }

  /**
   * @description Generates letter options for a given solution word.
   * This is a shared concrete implementation for all clue games.
   */
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    // The `isKidsMode` flag is determined by the subclass implementation.
    return generateLetters(solution, difficulty, language, this.isKidsMode());
  }

  // --- Abstract Methods for Subclasses to Implement ---

  protected abstract getGameId(): 'phrase-clue' | 'img-clue';
  protected abstract getModulePath(language: Language, category: GameCategory, difficulty?: Difficulty): string;
  protected abstract validateLevel(levelData: unknown, difficulty?: Difficulty): T | null;
  protected abstract getErrorLevel(): T;
  protected abstract isKidsMode(): boolean;
}
