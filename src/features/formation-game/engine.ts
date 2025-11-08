// src/features/formation-game/engine.ts
/**
 * @description Game engine for the Word Formation (Crossword) Challenge.
 * This engine handles loading levels and generating letter sets for the game.
 * --- It now extends the BaseGameEngine for architectural consistency,
 * but overrides the `loadLevels` method to handle its unique, non-category-based loading logic. ---
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import { BaseGameEngine } from '@/games/engine/BaseGameEngine';

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
 * (This is a shared convention across engines).
 */
interface LevelModule {
  default?: { levels?: unknown[] }; // Optional default export containing levels array
}

/**
 * Implements the game engine for the Word Formation (Crossword) Challenge.
 * --- Now extends BaseGameEngine. ---
 */
class FormationGameEngine extends BaseGameEngine<FormationLevel> {
  /**
   * --- OVERRIDE: This engine has simpler loading logic that doesn't use categories. ---
   * We override the base `loadLevels` method to implement this specific logic directly,
   * while preserving all original functionality.
   * @param options - Configuration options for loading levels
   * @returns Promise<FormationLevel[]> - Array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[]; // Kept for interface consistency, but unused.
    difficulty?: Difficulty;
  }): Promise<FormationLevel[]> {
    const { language, difficulty } = options;
    // This game requires a difficulty to load levels.
    if (!difficulty) return []; // Return empty array if no difficulty specified

    try {
      // Construct the path to the JSON file using the getModulePath helper method.
      const path = this.getModulePath(language, '' as GameCategory, difficulty);

      // Get all JSON module importers
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      // Return empty array if the specific file doesn't exist (original behavior).
      if (!moduleLoader) {
        return [];
      }

      // Load the module and extract levels
      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      // Transform and validate each level using the validateLevel helper method.
      const validatedLevels = levels
        .map(lvl => this.validateLevel(lvl, difficulty))
        .filter((l): l is FormationLevel => l !== null); // Filter out null values

      // If validation results in an empty array, return it (original behavior).
      if (validatedLevels.length === 0) {
        return [];
      }
      
      return validatedLevels;

    } catch (err) {
      // Log error and return an error level if loading fails (original behavior).
      console.error(`FormationGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [this.getErrorLevel()];
    }
  }

  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'formation';
  }

  protected getModulePath(language: Language, _: GameCategory, difficulty?: Difficulty): string {
    // The path for this game is based on difficulty, not category.
    return `/src/data/${language}/formation/${difficulty}.json`;
  }

  protected validateLevel(levelData: unknown, difficulty?: Difficulty): FormationLevel | null {
    const lvl = levelData as Record<string, unknown>;
    // Check if the level has the required properties
    if (
      lvl && typeof lvl === 'object' &&
      'id' in lvl && 'words' in lvl && Array.isArray(lvl.words) &&
      'grid' in lvl && 'baseLetters' in lvl
    ) {
      return {
        id: String(lvl.id),
        difficulty: difficulty ?? 'easy', // Assign difficulty from context
        words: lvl.words as string[],
        grid: lvl.grid as GridCell[],
        baseLetters: String(lvl.baseLetters),
        solution: (lvl.words as string[])[0] || '', // Use first word as solution
      };
    }
    return null; // Skip invalid levels
  }

  protected getErrorLevel(): FormationLevel {
    // Returns a default error level object to prevent crashes, matching original behavior.
    return { id: 'error', difficulty: 'easy', words: [], grid: [], baseLetters: 'ERROR', solution: '' };
  }

  /**
   * Generates a shuffled array of letters from the base letters.
   * --- The signature is now corrected to only accept the argument it actually uses. ---
   * @param baseLetters - The base set of letters to shuffle
   * @returns string[] - Shuffled array of letters
   */
  public generateLetters(baseLetters: string): string[] {
    if (!baseLetters) return []; // Return empty array if no base letters provided
    return shuffleArray(baseLetters.split('')); // Split base letters into array and shuffle
  }
}

// Export a singleton instance of the game engine
export const formationGameEngine = new FormationGameEngine();
