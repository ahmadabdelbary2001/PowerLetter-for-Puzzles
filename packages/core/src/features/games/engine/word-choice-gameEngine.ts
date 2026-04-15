// src/features/word-choice-game/engine.ts
/**
 * @description The game engine for the Word Choice game.
 * It extends the shared ChoiceGameEngine and delegates to domain services.
 */
import { ChoiceGameEngine } from './ChoiceGameEngine';
import type { Language, GameCategory } from '@powerletter/core';
import type { LevelModule } from './BaseGameEngine';
// Import FSD entities
import { wordChoiceRepository as levelRepository } from '@core/entities/repository/WordChoiceRepository';
import { wordChoiceValidationService as validationService } from '@core/entities/service/WordChoiceValidationService';
import type { WordChoiceLevel } from '@core/entities/model/WordChoice';

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

  protected async loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    // Use the static repository to avoid template literal dynamic imports failing at build time
    const levels = await levelRepository.loadLevels({ language, category });
    return { levels };
  }

  // --- Delegate to domain validation service ---
  protected validateLevel(levelData: unknown): WordChoiceLevel | null {
    if (validationService.isValidLevel(levelData)) {
      return levelData as WordChoiceLevel;
    }
    return null;
  }

  protected getErrorLevel(): WordChoiceLevel {
    return validationService.createErrorLevel();
  }
}

// Export a single instance of the engine.
export const wordChoiceGameEngine = new WordChoiceGameEngine();
