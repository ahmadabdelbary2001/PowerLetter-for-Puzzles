// src/games/engine/ChoiceGameEngine.ts
/**
 * @description An abstract base class for "choice-style" game engines.
 * It provides all the common logic for loading levels from JSON files,
 * including category resolution, dynamic module importing, and level validation.
 * Subclasses only need to provide their specific game ID.
 */
import type { Language, GameCategory, GameLevel } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import { GAME_REGISTRY } from '@/games/GameRegistry';
import type { IGameEngine } from './types';

/**
 * @interface ChoiceLevel
 * @description Defines the base structure for any level in a choice-based game.
 */
export interface ChoiceLevel extends GameLevel {
  solution: string;
  options: string[];
}

// Interface for the module structure returned when dynamically importing JSON level files
interface LevelModule {
  default?: { levels?: unknown[] };
}

// The abstract base class containing the shared logic
export abstract class ChoiceGameEngine<T extends ChoiceLevel> implements IGameEngine<T> {
  /**
   * @description The main level loading function. This is the shared logic.
   * It orchestrates the loading process by calling an abstract method that subclasses must implement.
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<T[]> {
    const { language, categories } = options;
    const gameId = this.getGameId(); // Get the specific game ID from the subclass

    // Resolve categories: if 'general' is selected, get all available categories for this game.
    const gameConfig = GAME_REGISTRY.find(game => game.id === gameId);
    const allAvailableCategories = gameConfig?.availableCategories?.filter(cat => cat !== 'general') ?? [];
    const categoriesToLoad = categories.includes('general') ? allAvailableCategories : categories;

    // Get all JSON modules from the data directory.
    const modules = import.meta.glob('/src/data/**/*.json') as Record<string, () => Promise<LevelModule>>;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        // Construct the path using the game ID provided by the subclass.
        const path = `/src/data/${language}/${gameId}/${cat}/data.json`;
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`${gameId} Engine: Module not found for path: ${path}`);
          return [];
        }

        const module = await moduleLoader();
        const rawLevels = module.default?.levels || [];

        // Validate each level to ensure it has the required fields.
        return rawLevels
          .map((lvl: unknown): T | null => {
            // --- Use a safe type assertion instead of 'any' ---
            const levelObj = lvl as Record<string, unknown>;

            if (
              typeof levelObj === 'object' && levelObj !== null &&
              'id' in levelObj && 'solution' in levelObj && 'options' in levelObj &&
              Array.isArray(levelObj.options) // Check if 'options' is an array
            ) {
              // --- Safely access properties after validation ---
              const options = levelObj.options as string[];
              const solution = levelObj.solution as string;

              // Ensure the solution is always included in the options.
              const finalOptions = new Set(options);
              finalOptions.add(solution);
              
              // Re-assign the corrected options back to the object
              levelObj.options = Array.from(finalOptions);

              return levelObj as T;
            }
            return null;
          })
          .filter((l): l is T => l !== null);
      } catch (err) {
        console.error(`${gameId} Engine: Failed to load levels for ${language}/${cat}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      // Return a generic error level if no levels were loaded.
      return [{
        id: 'error-level',
        solution: 'ERROR',
        options: ['Error'],
      } as T];
    }

    return shuffleArray(allLevels);
  }

  /**
   * @description Abstract method for subclasses to implement.
   * @returns The unique ID of the game (e.g., 'img-choice', 'word-choice').
   */
  protected abstract getGameId(): 'img-choice' | 'word-choice';
}
