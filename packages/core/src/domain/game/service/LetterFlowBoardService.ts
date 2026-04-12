// src/domain/game/service/LetterFlowBoardService.ts
/**
 * Service for Letter Flow board operations
 */

import type { BoardCell, PathPoint } from '../model/LetterFlow';
import { COLOR_PALETTE_COUNT, DEFAULT_SATURATION, DEFAULT_LIGHTNESS } from '../model/LetterFlow';
import { shuffleArray } from '@core/lib/gameUtils';

let wasmEngine: {
  letter_flow_generate_board?: (letters: string) => BoardCell[];
} | null = null;

/** Initialize WASM engine */
export async function initWasmEngine(): Promise<void> {
  if (wasmEngine) return;
  
  try {
    // Note: We need to adjust this path later if the wasm structure changes
    // @ts-ignore - WASM module loaded dynamically
    const module = await import(/* @vite-ignore */ '@core/wasm/power-engine');
    wasmEngine = module;
  } catch {
    wasmEngine = null;
  }
}

/** Generate HSL color for index */
function hslForIndex(index: number, total: number): string {
  if (total <= 0) return `hsl(0, ${DEFAULT_SATURATION}%, ${DEFAULT_LIGHTNESS}%)`;
  const hue = Math.round((index * 360) / total) % 360;
  return `hsl(${hue}, ${DEFAULT_SATURATION}%, ${DEFAULT_LIGHTNESS}%)`;
}

export class LetterFlowBoardService {
  /**
   * Generate color for a string (stable hash-based)
   */
  colorForString(s: string | undefined | null): string | undefined {
    if (!s) return undefined;

    let hash = 0;
    const up = s.toUpperCase();
    for (let i = 0; i < up.length; i++) {
      hash = ((hash << 5) - hash) + up.charCodeAt(i);
      hash |= 0;
    }

    const idx = Math.abs(hash) % COLOR_PALETTE_COUNT;
    return hslForIndex(idx, COLOR_PALETTE_COUNT);
  }

  /**
   * Generate board from letters (WASM with JS fallback)
   */
  generateBoard(letters: string): BoardCell[] {
    if (!letters) return [];

    // Try WASM first
    if (wasmEngine?.letter_flow_generate_board) {
      try {
        return wasmEngine.letter_flow_generate_board(letters);
      } catch (e) {
        console.warn('WASM board generation failed, falling back to JS', e);
      }
    }

    // JS fallback
    const chars = shuffleArray(letters.split(''));
    const size = Math.ceil(Math.sqrt(chars.length));
    const board: BoardCell[] = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const index = y * size + x;
        if (index < chars.length) {
          board.push({
            x,
            y,
            letter: chars[index],
            isUsed: false,
          });
        }
      }
    }

    return board;
  }

  /**
   * Assign colors to endpoints
   */
  assignEndpointColors(endpoints: PathPoint[]): PathPoint[] {
    const uniqueLetters = [...new Set(endpoints.map(e => e.letter))];
    const letterToColor = new Map<string, string>();

    uniqueLetters.forEach((letter, idx) => {
      letterToColor.set(letter, hslForIndex(idx, uniqueLetters.length));
    });

    return endpoints.map(ep => ({
      ...ep,
      color: letterToColor.get(ep.letter),
    }));
  }

  /**
   * Build board from level data
   */
  buildBoardFromLevel(
    levelData: { gridSize: { width: number; height: number }; endpoints: PathPoint[] }
  ): BoardCell[] {
    const { width, height } = levelData.gridSize;
    const { endpoints } = levelData;

    const board: BoardCell[] = Array.from({ length: width * height }, (_, i) => ({
      x: i % width,
      y: Math.floor(i / width),
      letter: '',
      isUsed: false,
    }));

    const coloredEndpoints = this.assignEndpointColors(endpoints);

    coloredEndpoints.forEach(ep => {
      const index = ep.y * width + ep.x;
      if (index < board.length) {
        board[index] = {
          x: ep.x,
          y: ep.y,
          letter: ep.letter,
          isUsed: false,
          color: ep.color,
        };
      }
    });

    return board;
  }

  /**
   * Reset board to initial state
   */
  resetBoard(board: BoardCell[]): BoardCell[] {
    return board.map(cell => ({
      ...cell,
      isUsed: false,
    }));
  }

  /**
   * Mark cells as used for a completed path
   */
  markPathCells(board: BoardCell[], path: BoardCell[], color?: string): BoardCell[] {
    const pathSet = new Set(path.map(c => `${c.x}-${c.y}`));
    
    return board.map(cell => {
      if (pathSet.has(`${cell.x}-${cell.y}`)) {
        return { ...cell, isUsed: true, color };
      }
      return cell;
    });
  }
}

export const letterFlowBoardService = new LetterFlowBoardService();
