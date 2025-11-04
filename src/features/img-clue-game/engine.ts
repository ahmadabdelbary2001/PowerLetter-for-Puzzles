// src/features/img-clue-game/engine.ts
/**
 * ImgClueGameEngine - Implements game logic for the image clue puzzle game for kids
 * Handles loading levels from JSON files and generating letter options for the player
 * Uses images and sounds instead of text clues for a kid-friendly experience
 */
import type { Language, GameCategory, Difficulty } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

/**
 * Interface defining the structure of an image clue game level
 */
export interface ImageLevel {
  /** Unique identifier for the level */
  id: string;
  /** Path to the image clue */
  image: string;
  /** Path to the audio clue */
  sound: string;
  /** The solution word that players need to guess */
  solution: string;
}

/**
 * Interface for dynamically imported level modules
 */
interface LevelModule {
  /** Default export containing levels */
  default?: { levels?: unknown[] };
}

/**
 * Engine class that handles loading and processing image clue game levels
 * Implements the IGameEngine interface for consistency across game types
 */
class ImgClueGameEngine implements IGameEngine<ImageLevel> {
  /**
   * Loads game levels based on language and categories
   * @param options - Configuration for level loading
   * @returns Promise resolving to an array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<ImageLevel[]> {
    const { language, categories } = options;
    // All kid-friendly categories available for this game type
    const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits-and-vegetables', 'shapes'];
    // If 'general' is selected, load all categories; otherwise load only selected ones
    const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

    // Create promises to load levels for each category
    const promises = categoriesToLoad.map(async (cat) => {
      try {
        // Construct path to the JSON file containing levels
        const path = `/src/data/${language}/image-clue/${cat}/data.json`;
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
        const levels = module.default?.levels || [];

        // Transform level data to ensure correct format
        return levels.map((lvl: unknown): ImageLevel | null => {
          // Validate that all required fields are present
          if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl) {
            return {
              id: String(lvl.id),
              image: String(lvl.image),
              sound: String(lvl.sound),
              solution: String(lvl.solution),
            };
          }
          return null;
        }).filter((l): l is ImageLevel => l !== null);
      } catch (err) {
        // Log errors and return empty array if loading fails
        console.error(`ImgClueGameEngine: Failed to load levels for ${language}/${cat}.`, err);
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
        image: '/assets/images/error.png',
        sound: '',
        solution: 'ERROR'
      }];
    }
    // Shuffle levels for random gameplay
    return shuffleArray(allLevels);
  }

  /**
   * Generates letter options for a given solution word
   * Uses the shared generateLetters utility function with kids mode enabled
   * @param solution - The target word to generate letters for
   * @param difficulty - Game difficulty level
   * @param language - Game language
   * @returns Array of letter options including the solution letters
   */
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    return generateLetters(solution, difficulty, language, true); // isKidsMode is true
  }
}

// Export a singleton instance of the engine
export const imgClueGameEngine = new ImgClueGameEngine();
