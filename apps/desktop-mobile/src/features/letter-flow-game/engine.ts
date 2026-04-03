// src/features/letter-flow-game/engine.ts
/**
 * @description Game engine for the Letter Flow game.
 * This engine handles loading game levels, generating game boards, and assigning colors.
 * --- It now extends the BaseGameEngine for architectural consistency,
 * but overrides the `loadLevels` method to handle its unique, non-category-based loading logic. ---
 */
import type { Language, Difficulty, GameCategory, GameLevel } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import { BaseGameEngine } from '@/games/engine/BaseGameEngine';

/**
 * Represents a single cell on the game board
 */
export interface BoardCell {
  x: number;           // X coordinate on the board
  y: number;           // Y coordinate on the board
  letter: string;      // Letter displayed in this cell
  isUsed: boolean;     // Whether this cell has been used in a word path
  color?: string;      // CSS color for visual distinction
}

/**
 * --- This interface is now correctly exported. ---
 * Represents a path that forms a word on the game board
 */
export interface WordPath {
  word: string;        // The word formed by this path
  cells: BoardCell[]; // Array of cells that make up this path
  startIndex: number;  // Starting index of the word in the solution
}

/**
 * Represents a complete level in the Letter Flow game
 */
export interface LetterFlowLevel extends GameLevel {
  id: string;
  difficulty: Difficulty;
  words: string[];
  board: BoardCell[];
  solution: string;
  endpoints: { x: number; y: number; letter: string; color?: string }[];
}

/**
 * Represents a module structure for level data
 */
interface LevelModule {
  default?: { levels?: unknown[] };
}

/**
 * Generates an HSL color with evenly distributed hues for visual distinction.
 */
function hslForIndex(index: number, total: number, saturation = 70, lightness = 50): string {
  if (total <= 0) return `hsl(0, ${saturation}%, ${lightness}%)`;
  const hue = Math.round((index * 360) / total) % 360;
  const adjustedLightness = lightness > 50 ? lightness * 0.9 : lightness * 1.1;
  return `hsl(${hue}, ${saturation}%, ${adjustedLightness}%)`;
}

/**
 * Main game engine class for the Letter Flow game.
 * --- Now extends BaseGameEngine. ---
 */
class LetterFlowGameEngine extends BaseGameEngine<LetterFlowLevel> {
  /**
   * --- This engine has unique logic for board generation within the loading process. ---
   * We override the base `loadLevels` to preserve this specific functionality.
   */
  public async loadLevels(options: {
    language: Language;
    difficulty?: Difficulty;
  }): Promise<LetterFlowLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return [];

    try {
      const path = this.getModulePath(language, '' as GameCategory, difficulty);
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];
      if (!moduleLoader) return [];

      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      return levels
        .map((lvl: unknown): LetterFlowLevel | null => this.validateLevel(lvl, difficulty))
        .filter((l): l is LetterFlowLevel => l !== null);
    } catch (err) {
      console.error(`LetterFlowGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [this.getErrorLevel()];
    }
  }

  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'letter-flow';
  }

  protected getModulePath(language: Language, _: GameCategory, difficulty?: Difficulty): string {
    return `/src/data/${language}/letter-flow/${difficulty}.json`;
  }

  protected validateLevel(levelData: unknown, difficulty?: Difficulty): LetterFlowLevel | null {
    const lvl = levelData as Record<string, unknown>;
    if (
      lvl && typeof lvl === 'object' &&
      'id' in lvl && 'solutionWord' in lvl && 'gridSize' in lvl && 'endpoints' in lvl
    ) {
      const { width, height } = (lvl as { gridSize: { width: number; height: number } }).gridSize;
      const board: BoardCell[] = Array.from({ length: width * height }, (_, i) => ({
        x: i % width, y: Math.floor(i / width), letter: '', isUsed: false
      }));

      const endpoints = (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints;
      const uniqueLetters = Array.from(new Set(endpoints.map(e => e.letter)));
      const letterToColor = new Map<string, string>();
      uniqueLetters.forEach((letter, idx) => {
        letterToColor.set(letter, hslForIndex(idx, uniqueLetters.length, 72, 48));
      });

      endpoints.forEach((endpoint) => {
        const index = endpoint.y * width + endpoint.x;
        if (index < board.length) {
          board[index] = { ...endpoint, isUsed: false, color: letterToColor.get(endpoint.letter) };
        }
      });

      const typedLvl = lvl as { id: string | number; solutionWord: string; endpoints: { x: number; y: number; letter: string }[] };
      return {
        id: String(typedLvl.id),
        difficulty: difficulty ?? 'easy',
        words: [typedLvl.solutionWord],
        board,
        solution: typedLvl.solutionWord,
        endpoints: typedLvl.endpoints.map(e => ({ ...e, color: letterToColor.get(e.letter) })),
      };
    }
    return null;
  }

  protected getErrorLevel(): LetterFlowLevel {
    return {
      id: 'error',
      difficulty: 'easy',
      words: [],
      board: [],
      solution: '',
      endpoints: [],
    };
  }

  /**
   * --- This public method is now correctly restored to the class. ---
   * Generate a game board from a string of letters. This is used as a fallback.
   */
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
 * Create and export a singleton instance of the game engine.
 */
export const letterFlowGameEngine = new LetterFlowGameEngine();
