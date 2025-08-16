// src/games/engine/types.ts
import type { Language, GameCategory, Difficulty } from '@/types/game';

/**
 * Defines the common interface for any game engine in the application.
 * This ensures that all games, regardless of their specific logic,
 * can be loaded and managed in a consistent way.
 *
 * @template TLevel The specific type of level data this engine works with (e.g., Level, ImageLevel).
 */
export interface IGameEngine<TLevel> {
  /**
   * Loads the levels for a game based on the provided options.
   * This is the core method required by all engines.
   * @param options - The configuration for loading levels, including language, categories, and difficulty.
   * @returns A promise that resolves to an array of levels.
   */
  loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty; // Optional, as not all games have difficulty (e.g., kids' games)
  }): Promise<TLevel[]>;

  /**
   * Generates the letters for a game grid.
   * This method is optional as it only applies to games with letter grids.
   * @param solution - The solution word to generate letters from.
   * @param difficulty - The difficulty level, which determines the number of letters.
   * @returns An array of shuffled letters.
   */
  generateLetters?(solution: string, difficulty: Difficulty, language: Language): string[];
  
  /**
   * Generates a set of choices for multiple-choice games.
   * This method is optional.
   * @param solution - The correct answer.
   * @param allPossibleWords - A list of all words in the category to pull distractors from.
   * @returns An array of shuffled choices including the solution.
   */
  generateOptions?(solution: string, allPossibleWords: string[]): string[];
}
