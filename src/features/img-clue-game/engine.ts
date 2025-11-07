// src/features/img-clue-game/engine.ts
/**
 * @description The game engine for the Image Clue game.
 * It extends the shared ClueGameEngine to inherit all common level-loading logic,
 * and only needs to provide its unique, game-specific implementation details.
 */
import type { Language, GameCategory } from '@/types/game';
import { ClueGameEngine, type ClueLevel } from '@/games/engine/ClueGameEngine';

/**
 * @interface ImageLevel
 * @description Defines the specific structure of a level for the Image Clue game.
 */
export interface ImageLevel extends ClueLevel {
  image: string;
  sound: string;
}

// The engine class extends the base and implements the required abstract methods.
class ImgClueGameEngine extends ClueGameEngine<ImageLevel> {
  protected getGameId(): 'img-clue' {
    return 'img-clue';
  }

  protected getModulePath(language: Language, category: GameCategory): string {
    // This game does not use difficulty in its path structure.
    return `/src/data/${language}/img-clue/${category}/data.json`;
  }

  protected validateLevel(levelData: unknown): ImageLevel | null {
    const lvl = levelData as Record<string, unknown>;
    if (lvl && typeof lvl === 'object' && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl) {
      return {
        id: String(lvl.id),
        image: String(lvl.image),
        sound: String(lvl.sound),
        solution: String(lvl.solution),
      };
    }
    return null;
  }

  protected getErrorLevel(): ImageLevel {
    return {
      id: 'error-level',
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR',
    };
  }

  protected isKidsMode(): boolean {
    // Image clue game is considered a kids' game for letter generation.
    return true;
  }
}

// Export a single instance of the engine.
export const imgClueGameEngine = new ImgClueGameEngine();
