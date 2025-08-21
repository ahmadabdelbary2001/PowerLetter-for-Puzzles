// src/features/clue-game/engine.ts
/**
 * Clue Game Engine - Implements game logic for the word clue puzzle game
 * Handles loading levels from JSON files and generating letter options for the player
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils'; // Import the shared function
import type { IGameEngine } from '@/games/engine/types';

/**
 * Interface defining the structure of a clue game level
 */
export interface Level {
  /** Unique identifier for the level */
  id: string;
  /** Difficulty level of the puzzle */
  difficulty: Difficulty;
  /** Text clue that hints at the solution word */
  clue: string;
  /** The solution word that players need to guess */
  solution: string;
}

/**
 * Interface for dynamically imported level modules
 */
interface LevelModule {
  /** Default export containing levels */
  default?: { levels?: unknown[] };
  /** Direct export of levels array */
  levels?: unknown[];
}

/**
 * Engine class that handles loading and processing clue game levels
 * Implements the IGameEngine interface for consistency across game types
 */
class ClueGameEngine implements IGameEngine<Level> {
  /**
   * Loads game levels based on language, categories, and difficulty
   * @param options - Configuration for level loading
   * @returns Promise resolving to an array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty: Difficulty;
  }): Promise<Level[]> {
    const { language, categories, difficulty } = options;
    // All specific categories available for this game type
    const ALL_CATEGORIES: GameCategory[] = ['animals', 'science', 'geography'];
    // If 'general' is selected, load all categories; otherwise load only selected ones
    const categoriesToLoad = categories.includes('general') ? ALL_CATEGORIES : categories;

    // Create promises to load levels for each category
    const promises = categoriesToLoad.map(async (cat) => {
      try {
        // Construct path to the JSON file containing levels
        const path = `/src/data/${language}/clue/${cat}/${language}-clue-${cat}-${difficulty}.json`;
        // Get all JSON import modules
        const modules = import.meta.glob('/src/data/**/*.json');
        // Find the specific module loader for our path
        const moduleLoader = modules[path];

        // If module not found, log warning and return empty array
        if (!moduleLoader) {
          console.warn(`Module not found for path: ${path}`);
          return [];
        }

        // Load the module and extract levels
        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || module.levels || [];

        // Transform level data to ensure correct format
        return levels.map((lvl: unknown): Level | null => {
          if (typeof lvl === 'object' && lvl !== null) {
            const levelObj = lvl as Record<string, unknown>;
            return {
              id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2, 8)}`),
              clue: String(levelObj.clue ?? ''),
              solution: String(levelObj.solution ?? ''),
              difficulty,
            };
          }
          return null;
        }).filter((l): l is Level => l !== null);
      } catch (err) {
        // Log errors and return empty array if loading fails
        console.error(`ClueGameEngine: Failed to load levels for ${language}/${cat}/${difficulty}.`, err);
        return [];
      }
    });

    // Wait for all category loading to complete
    const results = await Promise.all(promises);
    const allLevels = results.flat();

    // If no levels were loaded, return a fallback error level
    if (allLevels.length === 0) {
      return [{
        id: 'error-level',
        difficulty: 'easy',
        clue: 'Could not load levels for the selected categories.',
        solution: 'ERROR'
      }];
    }
    // Shuffle levels for random gameplay
    return shuffleArray(allLevels);
  }

  /**
   * Generates letter options for a given solution word
   * Uses the shared generateLetters utility function
   * @param solution - The target word to generate letters for
   * @param difficulty - Game difficulty level
   * @param language - Game language
   * @returns Array of letter options including the solution letters
   */
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    return generateLetters(solution, difficulty, language, false); // isKidsMode is false
  }
}

// Export a singleton instance of the engine
export const clueGameEngine = new ClueGameEngine();
