// src/features/phrase-clue-game/engine.ts
/**
 * @description The game engine for the Phrase Clue game.
 * It extends the shared ClueGameEngine and delegates to domain services.
 */
import type { Language, GameCategory, Difficulty } from '@powerletter/core';
import { ClueGameEngine, type ClueLevel } from '../../games/engine/ClueGameEngine';
import type { LevelModule } from '../../games/engine/BaseGameEngine';
// Import domain services
import { levelRepository, validationService } from '../../domain/phrase-clue';

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

  // --- Delegate to domain repository for loading ---
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<PhraseLevel[]> {
    const category = options.categories[0];
    if (!category || !options.difficulty) return [];
    return levelRepository.loadLevels({
      language: options.language,
      category,
      difficulty: options.difficulty,
    });
  }

  protected loadModule(language: Language, category: GameCategory, difficulty?: Difficulty): Promise<LevelModule> {
    // Still provide the dynamic import for base class compatibility
    return import(`../../data/${language}/phrase-clue/${category}/${difficulty}.json`);
  }

  // --- Delegate to domain validation service ---
  protected validateLevel(levelData: unknown, difficulty?: Difficulty): PhraseLevel | null {
    if (validationService.isValidLevel(levelData)) {
      // Ensure difficulty is set
      if (difficulty && levelData && typeof levelData === 'object') {
        (levelData as PhraseLevel).difficulty = difficulty;
      }
      return levelData as PhraseLevel;
    }
    return null;
  }

  protected getErrorLevel(): PhraseLevel {
    return validationService.createErrorLevel();
  }

  protected isKidsMode(): boolean {
    // Phrase clue game is not a kids' game for letter generation.
    return false;
  }
}

// Export a single instance of the engine.
export const phraseClueGameEngine = new PhraseClueGameEngine();
