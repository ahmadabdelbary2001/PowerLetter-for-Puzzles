// src/features/phrase-clue-game/engine.ts
/**
 * @description The game engine for the Phrase Clue game.
 * It extends the shared ClueGameEngine to inherit all common level-loading logic,
 * and only needs to provide its unique, game-specific implementation details.
 */
import type { Language, GameCategory, Difficulty } from '@/types/game';
import { ClueGameEngine, type ClueLevel } from '@/games/engine/ClueGameEngine';

/**
 * @interface PhraseLevel
 * @description Defines the specific structure of a level for the Phrase Clue game.
 */
export interface PhraseLevel extends ClueLevel {
  difficulty: Difficulty;
  clue: string;
}

// The engine class extends the base and implements the required abstract methods.
class PhraseClueGameEngine extends ClueGameEngine<PhraseLevel> {
  protected getGameId(): 'phrase-clue' {
    return 'phrase-clue';
  }

  protected getModulePath(language: Language, category: GameCategory, difficulty?: Difficulty): string {
    return `/src/data/${language}/phrase-clue/${category}/${difficulty}.json`;
  }

  protected validateLevel(levelData: unknown, difficulty?: Difficulty): PhraseLevel | null {
    const lvl = levelData as Record<string, unknown>;
    if (lvl && typeof lvl === 'object' && 'id' in lvl && 'clue' in lvl && 'solution' in lvl) {
      return {
        id: String(lvl.id),
        clue: String(lvl.clue),
        solution: String(lvl.solution),
        difficulty: difficulty ?? 'easy',
      };
    }
    return null;
  }

  protected getErrorLevel(): PhraseLevel {
    return {
      id: 'error-level',
      difficulty: 'easy',
      clue: 'Could not load levels for the selected categories.',
      solution: 'ERROR',
    };
  }

  protected isKidsMode(): boolean {
    // Phrase clue game is not a kids' game for letter generation.
    return false;
  }
}

// Export a single instance of the engine.
export const phraseClueGameEngine = new PhraseClueGameEngine();
