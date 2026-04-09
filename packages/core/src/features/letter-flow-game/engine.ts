// src/features/letter-flow-game/engine.ts
/**
 * @description Game engine for the Letter Flow game.
 * This engine handles loading game levels, generating game boards, and assigning colors.
 * --- Refactored to use Domain Services from FSD architecture ---
 */
import type { Language, Difficulty, GameCategory } from '../../types/game';
// Re-export types from domain for backward compatibility
export type { BoardCell, LetterFlowLevel, WordPath } from '../../domain/letter-flow';
import type { BoardCell, LetterFlowLevel, PathPoint } from '../../domain/letter-flow';

import { BaseGameEngine } from '../../games/engine/BaseGameEngine';
import type { LevelModule } from '../../games/engine/BaseGameEngine';

// Import domain services
import { levelRepository } from '../../domain/letter-flow/repository';
import { boardService, validationService } from '../../domain/letter-flow/service';
import { initWasmEngine } from '../../domain/letter-flow/service/BoardService';

/**
 * WASM Initialization
 * Delegated to domain layer for better separation of concerns.
 */
let wasmInitialized = false;
const initWasm = async () => {
    if (!wasmInitialized) {
        await initWasmEngine();
        wasmInitialized = true;
    }
};

/**
 * Main game engine class for the Letter Flow game.
 * --- Now extends BaseGameEngine and delegates to domain services. ---
 */
class LetterFlowGameEngine extends BaseGameEngine<LetterFlowLevel> {
  /**
   * Override base `loadLevels` to handle Letter Flow's unique loading logic.
   */
  public async loadLevels(options: {
    language: Language;
    difficulty?: Difficulty;
  }): Promise<LetterFlowLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return [];

    try {
      // Use domain repository for loading
      const levels = await levelRepository.loadLevels({ language, difficulty });

      return levels
        .map((lvl: unknown): LetterFlowLevel | null => this.validateLevel(lvl, difficulty))
        .filter((l): l is LetterFlowLevel => l !== null);
    } catch (err) {
      console.error(`LetterFlowGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [validationService.createErrorLevel()];
    }
  }

  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'letter-flow';
  }

  protected loadModule(language: Language, _: GameCategory, difficulty?: Difficulty): Promise<LevelModule> {
    // Delegate to domain repository
    return levelRepository.loadModule(language, difficulty) as Promise<LevelModule>;
  }

  protected validateLevel(levelData: unknown, difficulty?: Difficulty): LetterFlowLevel | null {
    const lvl = levelData as Record<string, unknown>;
    if (
      lvl && typeof lvl === 'object' &&
      'id' in lvl && 'solutionWord' in lvl && 'gridSize' in lvl && 'endpoints' in lvl
    ) {
      // Use domain boardService for building board
      const gridSize = (lvl as { gridSize: { width: number; height: number } }).gridSize;
      const rawEndpoints = (lvl as { endpoints: { x: number; y: number; letter: string }[] }).endpoints;
      
      const endpoints: PathPoint[] = rawEndpoints.map(e => ({
        x: e.x,
        y: e.y,
        letter: e.letter,
        color: undefined, // Will be assigned by service
      }));

      const board = boardService.buildBoardFromLevel({
        gridSize,
        endpoints,
      });

      const typedLvl = lvl as { id: string | number; solutionWord: string };
      return {
        id: String(typedLvl.id),
        difficulty: difficulty ?? 'easy',
        words: [typedLvl.solutionWord],
        board,
        solution: typedLvl.solutionWord,
        endpoints: boardService.assignEndpointColors(endpoints),
      };
    }
    return null;
  }

  protected getErrorLevel(): LetterFlowLevel {
    return validationService.createErrorLevel();
  }

  /**
   * Generate a game board from a string of letters.
   * Delegates to boardService for WASM + JS fallback.
   */
  public generateBoard(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): BoardCell[] {
    if (!baseLetters) return [];
    // Delegate to domain service
    return boardService.generateBoard(baseLetters);
  }

  /**
   * Proactively trigger WASM loading when the engine is initialized.
   */
  public async init() {
    await initWasm();
  }
}

/**
 * Create and export a singleton instance of the game engine.
 */
export const letterFlowGameEngine = new LetterFlowGameEngine();
