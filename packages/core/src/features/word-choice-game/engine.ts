// src/features/word-choice-game/engine.ts
/**
 * @description The game engine for the Word Choice game.
 * It extends the shared ChoiceGameEngine and delegates to domain services.
 */
import { ChoiceGameEngine, type ChoiceLevel } from '../../games/engine/ChoiceGameEngine';
import type { Language, GameCategory } from '@powerletter/core';
import type { LevelModule } from '../../games/engine/BaseGameEngine';
// Import domain services
import { levelRepository, validationService } from '../../domain/word-choice';

/**
 * @interface WordChoiceLevel
 * @description Defines the specific structure of a level for the Word Choice game.
 * It extends the base ChoiceLevel with 'image' and 'sound' properties for the visual/audio prompt.
 */
export interface WordChoiceLevel extends ChoiceLevel {
  image: string;
  sound: string;
}

// The engine class extends the base and delegates to domain services.
class WordChoiceGameEngine extends ChoiceGameEngine<WordChoiceLevel> {
  protected getGameId(): 'word-choice' {
    return 'word-choice';
  }

  // --- Delegate to domain repository for loading ---
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<WordChoiceLevel[]> {
    // Load from first category (word-choice typically has single category)
    const category = options.categories[0];
    if (!category) return [];
    return levelRepository.loadLevels({ language: options.language, category });
  }

  protected loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    // Still provide the dynamic import for base class compatibility
    return import(`../../data/${language}/word-choice/${category}/data.json`);
  }

  // --- Delegate to domain validation service ---
  protected validateLevel(levelData: unknown): WordChoiceLevel | null {
    if (validationService.isValidLevel(levelData)) {
      return levelData;
    }
    return null;
  }

  protected getErrorLevel(): WordChoiceLevel {
    return validationService.createErrorLevel();
  }
}

// Export a single instance of the engine.
export const wordChoiceGameEngine = new WordChoiceGameEngine();
