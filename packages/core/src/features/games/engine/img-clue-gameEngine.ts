// src/features/img-clue-game/engine.ts
/**
 * @description The game engine for the Image Clue game.
 * It extends the shared ClueGameEngine and delegates to domain services.
 */
import type { Language, GameCategory } from "@powerletter/core";
import { ClueGameEngine } from "./ClueGameEngine";
import type { LevelModule } from "./BaseGameEngine";
// Import FSD entities
import { imgClueRepository as levelRepository } from "@core/entities/repository/ImgClueRepository";
import { imgClueValidationService as validationService } from "@core/entities/service/ImgClueValidationService";
import type { ImageLevel } from "@core/entities/model/ImgClue";

// The engine class extends the base and implements the required abstract methods.
class ImgClueGameEngine extends ClueGameEngine<ImageLevel> {
  protected getGameId(): "image-clue" {
    return "image-clue";
  }

  protected async loadModule(
    language: Language,
    category: GameCategory
  ): Promise<LevelModule> {
    // Use the static repository to avoid template literal dynamic imports failing at build time
    const levels = await levelRepository.loadLevels({ language, category });
    return { levels };
  }

  // --- Delegate to domain validation service ---
  protected validateLevel(levelData: unknown): ImageLevel | null {
    if (validationService.isValidLevel(levelData)) {
      return levelData as ImageLevel;
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
