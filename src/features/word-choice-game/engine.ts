// src/features/word-choice-game/engine.ts
// This file implements the game engine for the Word Choice game.
// It handles loading game levels from JSON files based on language and category,
// processes the level data, and ensures the solution is always included in the options.
import type { Language, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

// Interface defining the structure of a word choice game level
export interface WordChoiceLevel {
  id: string;        // Unique identifier for the level
  image: string;     // Path to the image file for this level
  sound: string;     // Path to the sound file for this level
  solution: string;  // The correct answer for this level
  options: string[]; // Array of possible answers (includes the solution)
}

// Interface for the module structure returned when dynamically importing JSON level files
interface LevelModule {
  default?: { levels?: unknown[] }; // The default export containing the levels array
}

// Implementation of the game engine for the Word Choice game
class WordChoiceGameEngine implements IGameEngine<WordChoiceLevel> {
  /**
   * Loads game levels based on language and categories
   * @param options - Configuration for loading levels
   * @param options.language - The language to load levels for
   * @param options.categories - The game categories to load levels for
   * @returns Promise resolving to an array of WordChoiceLevel objects
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<WordChoiceLevel[]> {
    const { language, categories } = options;
    // Define all available kids categories
    const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
    // If 'general' category is selected, load all kids categories; otherwise load the specified ones
    const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

    // Create a promise for each category to load its levels
    const promises = categoriesToLoad.map(async (cat) => {
      try {
        // Construct the path to the JSON file containing the levels for this category and language
        const path = `/src/data/${language}/word-choice/${cat}/data.json`;
        // Get all JSON files in the data directory
        const modules = import.meta.glob('/src/data/**/*.json');
        // Get the loader function for the specific path
        const moduleLoader = modules[path];

        // If no loader is found for this path, warn and return empty array
        if (!moduleLoader) {
          console.warn(`Module not found for path: ${path}`);
          return [];
        }

        // Load the module and extract the levels
        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || [];

        return levels.map((lvl: unknown): WordChoiceLevel | null => {
          if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl && 'options' in lvl && Array.isArray(lvl.options)) {
            
            // FIX: Ensure the solution is always part of the options list.
            // Use a Set to automatically handle duplicates if the solution was already in the options.
            const finalOptions = new Set(lvl.options as string[]);
            finalOptions.add(lvl.solution as string);

            return {
              id: String(lvl.id),
              image: String(lvl.image),
              sound: String(lvl.sound),
              solution: String(lvl.solution),
              // Convert the Set back to an array for the level object.
              options: Array.from(finalOptions),
            };
          }
          return null;
        }).filter((l): l is WordChoiceLevel => l !== null);
      } catch (err) {
        console.error(`WordChoiceGameEngine: Failed to load levels for ${language}/${cat}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      return [{
        id: 'error-level',
        image: '/assets/images/error.png',
        sound: '',
        solution: 'ERROR',
        options: ['Error', 'Loading', 'Failed'],
      }];
    }
    return shuffleArray(allLevels);
  }
}

export const wordChoiceGameEngine = new WordChoiceGameEngine();
