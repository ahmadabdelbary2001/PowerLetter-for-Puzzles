// src/features/letter-flow-game/engine.ts
/**
 * @description Game engine for the Word Flow game.
 * This engine handles loading levels and generating game boards for connecting letters to form words.
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

/**
 * Represents a single cell in the game board.
 */
export interface BoardCell {
  x: number;             // X coordinate in the grid
  y: number;             // Y coordinate in the grid
  letter: string;        // The letter displayed in this cell
  isUsed: boolean;       // Whether this cell has been used in a word
}

/**
 * Represents a path of cells that form a word.
 */
export interface WordPath {
  word: string;          // The word formed
  cells: BoardCell[];    // The cells that make up the word
  startIndex: number;    // Starting index of the word in the words array
}

/**
 * Represents a complete level in the Word Flow game.
 */
export interface WordFlowLevel {
  id: string;           // Unique identifier for the level
  difficulty: Difficulty; // Difficulty level (easy, medium, hard)
  words: string[];      // Array of words that can be formed in this level
  board: BoardCell[];   // Array of board cells
  solution: string;     // First word in the words array (to satisfy useGame constraint)
  endpoints: {          // Endpoint positions for letters
    x: number;
    y: number;
    letter: string;
  }[];
}

/**
 * Type definition for the structure of imported level modules.
 */
interface LevelModule {
  default?: { levels?: unknown[] }; // Optional default export containing levels array
}

/**
 * Implements the game engine for the Word Flow game.
 * Handles loading levels from JSON files and generating game boards.
 */
class WordFlowGameEngine implements IGameEngine<WordFlowLevel> {
  /**
   * Loads game levels based on the specified language, categories, and difficulty.
   * @param options - Configuration options for loading levels
   * @param options.language - The language to load levels for
   * @param options.categories - Array of game categories to filter by
   * @param options.difficulty - The difficulty level to load levels for
   * @returns Promise<WordFlowLevel[]> - Array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<WordFlowLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return []; // Return empty array if no difficulty specified

    try {
      // Construct the path to the JSON file containing levels for the specified language and difficulty
      const path = `/src/data/${language}/letter-flow/${language}-flow-${difficulty}.json`;

      // Get all JSON module importers
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      // Return empty array if the specific file doesn't exist
      if (!moduleLoader) return [];

      // Load the module and extract levels
      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      // Transform and validate each level
      return levels.map((lvl: unknown): WordFlowLevel | null => {
        // Check if the level has the required properties
        if (
          typeof lvl === 'object' && lvl !== null &&
          'id' in lvl && 'solutionWord' in lvl && 'gridSize' in lvl && 'endpoints' in lvl
        ) {
          // Convert endpoints to board cells
          const { width, height } = (lvl as { gridSize: { width: number; height: number } }).gridSize;
          const board: BoardCell[] = [];
          
          // Create a grid with empty cells
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              board.push({ x, y, letter: '', isUsed: false });
            }
          }
          
          // Place letters at endpoints
          const endpoints = (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints;
          endpoints.forEach((endpoint: { x: number; y: number; letter: string }) => {
            const index = endpoint.y * width + endpoint.x;
            if (index < board.length) {
              board[index] = { 
                x: endpoint.x, 
                y: endpoint.y, 
                letter: endpoint.letter, 
                isUsed: false 
              };
            }
          });
          
          return {
            id: String(lvl.id),
            difficulty,
            words: [(lvl as { solutionWord: string }).solutionWord], // Use solutionWord as the only word
            board,
            solution: (lvl as { solutionWord: string }).solutionWord, // Use solutionWord as solution
            endpoints: (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints,
          };
        }
        return null; // Skip invalid levels
      }).filter((l): l is WordFlowLevel => l !== null); // Filter out null values
    } catch (err) {
      // Log error and return error level if loading fails
      console.error(`WordFlowGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      const errorBoard: BoardCell[] = [];
      // Ensure errorBoard has the correct type
      const typedErrorBoard: BoardCell[] = errorBoard;
      const errorLevel: WordFlowLevel = {
        id: 'error' as string,
        difficulty: 'easy' as Difficulty,
        words: [] as string[],
        board: typedErrorBoard,
        solution: '',
        endpoints: [] as { x: number; y: number; letter: string }[]
      };
      return [errorLevel];
    }
  }

  /**
   * Generates a shuffled game board with the specified letters.
   * @param _s - Unused parameter (solution string)
   * @param _d - Unused parameter (difficulty)
   * @param _l - Unused parameter (language)
   * @param baseLetters - The base set of letters to place on the board
   * @returns BoardCell[] - Array of board cells with letters
   */
  public generateBoard(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): BoardCell[] {
    if (!baseLetters) return []; // Return empty array if no base letters provided

    const letters = shuffleArray(baseLetters.split('')); // Split base letters into array and shuffle
    const size = Math.ceil(Math.sqrt(letters.length)); // Calculate grid size based on number of letters
    const board: BoardCell[] = [];

    // Create a grid of cells with the shuffled letters
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = y * size + x;
        if (index < letters.length) {
          board.push({
            x,
            y,
            letter: letters[index],
            isUsed: false,
          });
        }
      }
    }

    return board;
  }
}

// Export a singleton instance of the game engine
export const wordFlowGameEngine = new WordFlowGameEngine();
