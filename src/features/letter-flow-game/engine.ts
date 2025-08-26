// src/features/letter-flow-game/engine.ts
/**
 * @description Game engine for the Letter Flow game.
 * 
 * This module provides the core game engine for the Letter Flow game, which involves
 * connecting letter endpoints to form words. The engine handles loading game levels,
 * generating game boards, and assigning colors to letters for visual distinction.
 * 
 * Key features:
 * - Loads level data from JSON files based on language and difficulty
 * - Creates game boards with letters placed at specific positions
 * - Assigns distinct colors to each letter for better visibility
 * - Implements the IGameEngine interface for consistency
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

/**
 * Represents a single cell on the game board
 */
export interface BoardCell {
  x: number;           // X coordinate on the board
  y: number;           // Y coordinate on the board
  letter: string;      // Letter displayed in this cell
  isUsed: boolean;     // Whether this cell has been used in a word path
  color?: string;      // CSS color (e.g. 'hsl(120, 65%, 50%)') for visual distinction
}

/**
 * Represents a path that forms a word on the game board
 */
export interface WordPath {
  word: string;        // The word formed by this path
  cells: BoardCell[]; // Array of cells that make up this path
  startIndex: number;  // Starting index of the word in the solution
}

/**
 * Represents a single level in the Letter Flow game
 */
export interface letterFlowLevel {
  id: string;                                            // Unique identifier for this level
  difficulty: Difficulty;                                // Difficulty setting for this level
  words: string[];                                      // List of words to find in this level
  board: BoardCell[];                                   // Game board configuration
  solution: string;                                     // The solution word for this level
  endpoints: { x: number; y: number; letter: string; color?: string }[]; // Letter endpoints on the board
}

/**
 * Represents a module structure for level data
 * Used when dynamically importing level JSON files
 */
interface LevelModule {
  default?: { levels?: unknown[] }; // Default export containing levels array
}

/**
 * Generates an HSL color with evenly distributed hues
 * 
 * This function creates visually distinct colors by spacing them evenly
 * across the color wheel. This helps players differentiate between different
 * letters in the game.
 * 
 * @param index - Index of the current item (0-based)
 * @param total - Total number of items
 * @param saturation - Color saturation percentage (default: 70)
 * @param lightness - Color lightness percentage (default: 50)
 * @returns HSL color string (e.g. 'hsl(120, 70%, 50%)')
 */
function hslForIndex(index: number, total: number, saturation = 70, lightness = 50) {
  if (total <= 0) return `hsl(0, ${saturation}%, ${lightness}%)`;
  // Calculate hue by evenly spacing colors around the color wheel
  const hue = Math.round((index * 360) / total) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Main game engine class for the Letter Flow game
 * 
 * This class implements the IGameEngine interface and provides the core functionality
 * for loading and managing Letter Flow game levels. It handles level data loading,
 * board generation, and color assignment for letters.
 */
class letterFlowGameEngine implements IGameEngine<letterFlowLevel> {
  /**
   * Loads game levels from JSON files based on language and difficulty
   * 
   * This method dynamically imports level data from JSON files located in the
   * /src/data/[language]/letter-flow/ directory. It processes the raw level data
   * and converts it into properly typed letterFlowLevel objects.
   * 
   * @param options - Configuration options for loading levels
   * @param options.language - Language of the levels to load
   * @param options.categories - Game categories (currently unused in Letter Flow)
   * @param options.difficulty - Difficulty level to load
   * @returns Promise resolving to an array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<letterFlowLevel[]> {
    // Extract language and difficulty from options
    const { language, difficulty } = options;
    // Return empty array if no difficulty specified
    if (!difficulty) return [];

    try {
      // Construct path to the level JSON file
      const path = `/src/data/${language}/letter-flow/${language}-flow-${difficulty}.json`;
      // Get all JSON modules using dynamic import
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];
      // Return empty array if module loader not found
      if (!moduleLoader) return [];

      // Load the module and extract levels
      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      // Process each level from the loaded data
      return levels
        .map((lvl: unknown): letterFlowLevel | null => {
          // Validate level structure before processing
          if (
            typeof lvl === 'object' &&
            lvl !== null &&
            'id' in lvl &&
            'solutionWord' in lvl &&
            'gridSize' in lvl &&
            'endpoints' in lvl
          ) {
            // Extract grid dimensions from level data
            const { width, height } = (lvl as { gridSize: { width: number; height: number } }).gridSize;
            // Initialize empty board with all cells
            const board: BoardCell[] = [];

            // Create board cells for each position
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                board.push({ x, y, letter: '', isUsed: false });
              }
            }

            // Extract endpoints from level data
            const endpoints = (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints;

            // Get unique letters to assign distinct colors
            const uniqueLetters = Array.from(new Set(endpoints.map(e => e.letter)));

            // Create mapping from letter to color for visual distinction
            const letterToColor = new Map<string, string>();
            uniqueLetters.forEach((letter, idx) => {
              letterToColor.set(letter, hslForIndex(idx, uniqueLetters.length, 72, 48));
            });

            // Place each endpoint on the board with its assigned color
            endpoints.forEach((endpoint) => {
              const index = endpoint.y * width + endpoint.x;
              const assignedColor = letterToColor.get(endpoint.letter);
              if (index < board.length) {
                board[index] = {
                  x: endpoint.x,
                  y: endpoint.y,
                  letter: endpoint.letter,
                  isUsed: false,
                  color: assignedColor
                };
              }
            });

            // Cast level to known type for property access
            const typedLvl = lvl as { id: string | number; solutionWord: string; endpoints: { x:number; y:number; letter:string }[] };

            // Create the properly typed level object
            return {
              id: String(typedLvl.id),
              difficulty,
              words: [typedLvl.solutionWord],
              board,
              solution: typedLvl.solutionWord,
              endpoints: typedLvl.endpoints.map(e => ({ ...e, color: letterToColor.get(e.letter) }))
            };
          }
          return null;
        })
        // Filter out null values and cast to letterFlowLevel
        .filter((l): l is letterFlowLevel => l !== null);
    } catch (err) {
      // Log error if level loading fails
      console.error(`LetterFlowGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      
      // Return a minimal error level to prevent crashes
      const errorBoard: BoardCell[] = [];
      const errorLevel: letterFlowLevel = {
        id: 'error',
        difficulty: 'easy' as Difficulty,
        words: [],
        board: errorBoard,
        solution: '',
        endpoints: []
      };
      return [errorLevel];
    }
  }

  /**
   * Generate a game board from a string of letters
   * 
   * This method creates a square board and places the given letters randomly
   * on the board. The board size is determined by the square root of the
   * number of letters, rounded up to ensure all letters fit.
   * 
   * @param _s - Unused parameter (solution word)
   * @param _d - Difficulty level (unused in this implementation)
   * @param _l - Language (unused in this implementation)
   * @param baseLetters - String of letters to place on the board
   * @returns Array of BoardCell objects representing the game board
   */
  // Use proper typed params instead of `any`.
  public generateBoard(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): BoardCell[] {
    if (!baseLetters) return [];

    // Shuffle the letters for random placement
    const letters = shuffleArray(baseLetters.split(''));
    // Calculate board size (square root of letter count, rounded up)
    const size = Math.ceil(Math.sqrt(letters.length));
    const board: BoardCell[] = [];

    // Create board cells for each position
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

/**
 * Create and export a singleton instance of the game engine
 * 
 * This ensures that only one instance of the engine is used throughout the application,
 * which is important for maintaining consistent state and avoiding duplicate resource usage.
 */
export const letterFlowGameEngineInstance = new letterFlowGameEngine();