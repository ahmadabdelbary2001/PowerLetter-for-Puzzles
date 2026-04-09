// src/features/img-clue-game/engine.ts
/**
 * @description The game engine for the Image Clue game.
 * It extends the shared ClueGameEngine and delegates to domain services.
 */
import type { Language, GameCategory } from '@powerletter/core';
import { ClueGameEngine, type ClueLevel } from '../../games/engine/ClueGameEngine';
import type { LevelModule } from '../../games/engine/BaseGameEngine';
// Import domain services
import { levelRepository, validationService } from '../../domain/img-clue';

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
  protected getGameId(): 'image-clue' {
    return 'image-clue';
  }

  // --- Delegate to domain repository for loading ---
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<ImageLevel[]> {
    // Load from first category (img-clue typically has single category)
    const category = options.categories[0];
    if (!category) return [];
    return levelRepository.loadLevels({ language: options.language, category });
  }

  protected loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    // Still provide the dynamic import for base class compatibility
    return import(`../../data/${language}/img-clue/${category}/data.json`);
  }

  // --- Delegate to domain validation service ---
  protected validateLevel(levelData: unknown): ImageLevel | null {
    if (validationService.isValidLevel(levelData)) {
      return levelData;
    }
    return null;
  }

  protected getErrorLevel(): ImageLevel {
    return validationService.createErrorLevel();
  }

  protected isKidsMode(): boolean {
    // Image clue game is considered a kids' game for letter generation.
    return true;
  }
}

// Export a single instance of the engine.
export const imgClueGameEngine = new ImgClueGameEngine();
