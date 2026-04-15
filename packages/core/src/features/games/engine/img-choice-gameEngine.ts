// src/features/img-choice-game/engine.ts
/**
 * @description The game engine for the Image Choice game.
 * It extends the shared ChoiceGameEngine and delegates to domain services.
 */
import { ChoiceGameEngine, type ChoiceLevel } from "./ChoiceGameEngine";
import type { Language, GameCategory } from "@powerletter/core";
import type { LevelModule } from "./BaseGameEngine";
// Import FSD entities
import { imgChoiceRepository as levelRepository } from "@core/entities/repository/ImgChoiceRepository";
import { imgChoiceValidationService as validationService } from "@core/entities/service/ImgChoiceValidationService";

/**
 * @interface ImgChoiceLevel
 * @description Defines the specific structure of a level for the Image Choice game.
 * It extends the base ChoiceLevel with a 'word' property for the text prompt.
 */
export interface ImgChoiceLevel extends ChoiceLevel {
  word: string;
  sound?: string;
}

// The engine class extends the base and delegates to domain services.
class ImageChoiceGameEngine extends ChoiceGameEngine<ImgChoiceLevel> {
  protected getGameId(): "img-choice" {
    return "img-choice";
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
  protected validateLevel(levelData: unknown): ImgChoiceLevel | null {
    if (validationService.isValidLevel(levelData)) {
      return levelData;
    }
    return null;
  }

  protected getErrorLevel(): ImgChoiceLevel {
    return validationService.createErrorLevel();
  }
}

// Export a single instance of the engine.
export const imgChoiceGameEngine = new ImageChoiceGameEngine();
