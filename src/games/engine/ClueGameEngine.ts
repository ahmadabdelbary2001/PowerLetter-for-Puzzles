// src/games/engine/ClueGameEngine.ts
/**
 * @description A specialized abstract base class for "clue-style" game engines.
 * It extends the foundational BaseGameEngine and adds shared logic specific
 * to clue games, such as letter generation.
 */
import type { Language, Difficulty, GameLevel } from '@/types/game';
import { generateLetters } from '@/lib/gameUtils';
import { BaseGameEngine } from './BaseGameEngine';

export interface ClueLevel extends GameLevel {
  solution: string;
}

export abstract class ClueGameEngine<T extends ClueLevel> extends BaseGameEngine<T> {
  /**
   * @description Generates letter options for a given solution word.
   * This is a shared concrete implementation for all clue games.
   */
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    // The `isKidsMode` flag is determined by the subclass implementation.
    return generateLetters(solution, difficulty, language, this.isKidsMode());
  }

  // --- New Abstract Method for its own children ---
  protected abstract isKidsMode(): boolean;
}
