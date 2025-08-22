// src/features/formation-game/engine.ts
/**
 * @description Game engine for the Word Formation (Crossword) Challenge.
 * This engine handles loading levels and generating letter sets for the game.
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

/**
 * Represents a single cell in the crossword grid.
 * Each cell has a position (x, y), a letter, and a list of word indices it belongs to.
 */
export interface GridCell {
  x: number;             // X coordinate in the grid
  y: number;             // Y coordinate in the grid
  letter: string;        // The letter displayed in this cell
  words: number[];       // Array of word indices that this cell is part of
}

/**
 * Represents a complete level in the Word Formation game.
 * Contains all the information needed to play a level.
 */
export interface FormationLevel {
  id: string;           // Unique identifier for the level
  difficulty: Difficulty; // Difficulty level (easy, medium, hard)
  words: string[];      // Array of words that can be formed in this level
  grid: GridCell[];     // Array of grid cells that make up the crossword
  baseLetters: string;  // The base set of letters available for forming words
  solution: string;     // First word in the words array (to satisfy useGame constraint)
}

/**
 * Type definition for the structure of imported level modules.
 */
interface LevelModule {
  default?: { levels?: unknown[] }; // Optional default export containing levels array
}

/**
 * Implements the game engine for the Word Formation (Crossword) Challenge.
 * Handles loading levels from JSON files and generating shuffled letter sets.
 */
class FormationGameEngine implements IGameEngine<FormationLevel> {
  /**
   * Loads game levels based on the specified language, categories, and difficulty.
   * @param options - Configuration options for loading levels
   * @param options.language - The language to load levels for
   * @param options.categories - Array of game categories to filter by
   * @param options.difficulty - The difficulty level to load levels for
   * @returns Promise<FormationLevel[]> - Array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<FormationLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return []; // Return empty array if no difficulty specified

    try {
      // Construct the path to the JSON file containing levels for the specified language and difficulty
      const path = `/src/data/${language}/formation/${language}-formation-${difficulty}.json`;

      // Get all JSON module importers
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      // Return empty array if the specific file doesn't exist
      if (!moduleLoader) return [];

      // Load the module and extract levels
      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      // Transform and validate each level
      return levels.map((lvl: unknown): FormationLevel | null => {
        // Check if the level has the required properties
        if (
          typeof lvl === 'object' && lvl !== null &&
          'id' in lvl && 'words' in lvl && Array.isArray(lvl.words) &&
          'grid' in lvl && 'baseLetters' in lvl
        ) {
          return {
            id: String(lvl.id),
            difficulty,
            words: lvl.words as string[],
            grid: lvl.grid as GridCell[],
            baseLetters: String(lvl.baseLetters),
            solution: (lvl.words as string[])[0] || '', // Use first word as solution
          };
        }
        return null; // Skip invalid levels
      }).filter((l): l is FormationLevel => l !== null); // Filter out null values
    } catch (err) {
      // Log error and return error level if loading fails
      console.error(`FormationGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [{ id: 'error', difficulty: 'easy', words: [], grid: [], baseLetters: 'ERROR', solution: '' }];
    }
  }

  /**
   * Generates a shuffled array of letters from the base letters.
   * @param _s - Unused parameter (solution string)
   * @param _d - Unused parameter (difficulty)
   * @param _l - Unused parameter (language)
   * @param baseLetters - The base set of letters to shuffle
   * @returns string[] - Shuffled array of letters
   */
  public generateLetters(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): string[] {
    if (!baseLetters) return []; // Return empty array if no base letters provided
    return shuffleArray(baseLetters.split('')); // Split base letters into array and shuffle
  }
}

// Export a singleton instance of the game engine
export const formationGameEngine = new FormationGameEngine();
