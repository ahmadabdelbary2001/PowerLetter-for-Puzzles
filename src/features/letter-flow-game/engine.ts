// src/features/letter-flow-game/engine.ts
/**
 * @description Game engine for the Letter Flow game.
 * Assigns per-letter pair colors that are maximally distinct (evenly spaced hues).
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

export interface BoardCell {
  x: number;
  y: number;
  letter: string;
  isUsed: boolean;
  color?: string; // CSS color (e.g. 'hsl(120, 65%, 50%)')
}

export interface WordPath {
  word: string;
  cells: BoardCell[];
  startIndex: number;
}

export interface letterFlowLevel {
  id: string;
  difficulty: Difficulty;
  words: string[];
  board: BoardCell[];
  solution: string;
  endpoints: { x: number; y: number; letter: string; color?: string }[];
}

interface LevelModule {
  default?: { levels?: unknown[] };
}

/**
 * Produce an HSL color string for a given index out of N, distributed evenly around the hue wheel.
 * Using high-ish saturation and medium lightness yields vivid, distinct colors suitable for paths.
 */
function hslForIndex(index: number, total: number, saturation = 70, lightness = 50) {
  if (total <= 0) return `hsl(0, ${saturation}%, ${lightness}%)`;
  const hue = Math.round((index * 360) / total) % 360;
  // use the comma-separated form to be broadly compatible
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

class letterFlowGameEngine implements IGameEngine<letterFlowLevel> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<letterFlowLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return [];

    try {
      const path = `/src/data/${language}/letter-flow/${language}-flow-${difficulty}.json`;
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];
      if (!moduleLoader) return [];

      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      return levels.map((lvl: unknown): letterFlowLevel | null => {
        if (
          typeof lvl === 'object' && lvl !== null &&
          'id' in lvl && 'solutionWord' in lvl && 'gridSize' in lvl && 'endpoints' in lvl
        ) {
          const { width, height } = (lvl as { gridSize: { width: number; height: number } }).gridSize;
          const board: BoardCell[] = [];

          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              board.push({ x, y, letter: '', isUsed: false });
            }
          }

          const endpoints = (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints;

          // Build unique-letter list (one entry per distinct letter) in stable order
          const uniqueLetters = Array.from(new Set(endpoints.map(e => e.letter)));

          // Map each unique letter to a distinct HSL color spread evenly around the hue wheel
          const letterToColor = new Map<string, string>();
          uniqueLetters.forEach((letter, idx) => {
            letterToColor.set(letter, hslForIndex(idx, uniqueLetters.length, 72, 48));
          });

          // Place endpoints on board and assign per-letter color
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

          // typed view of lvl to safely read id/solutionWord
          const typedLvl = lvl as { id: string | number; solutionWord: string; endpoints: { x:number; y:number; letter:string }[] };

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
      }).filter((l): l is letterFlowLevel => l !== null);
    } catch (err) {
      console.error(`LetterFlowGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
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

  public generateBoard(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): BoardCell[] {
    if (!baseLetters) return [];

    const letters = shuffleArray(baseLetters.split(''));
    const size = Math.ceil(Math.sqrt(letters.length));
    const board: BoardCell[] = [];

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

export const letterFlowGameEngineInstance = new letterFlowGameEngine();
