// src/features/phrase-clue-game/engine.ts
/**
 * @description The game engine for the Phrase Clue game.
 * It extends the shared ClueGameEngine and delegates to domain services.
 */
import type { Language, GameCategory, Difficulty } from '@powerletter/core';
import { ClueGameEngine, type ClueLevel } from './ClueGameEngine';
import type { LevelModule } from './BaseGameEngine';
// Import domain services
import { 
  phraseClueRepository as levelRepository, 
  phraseClueValidationService as validationService 
} from '@core/domain/game';

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

  protected async loadModule(language: Language, category: GameCategory, difficulty?: Difficulty): Promise<LevelModule> {
    // Use the static repository to avoid template literal dynamic imports failing at build time
    const diff = difficulty ?? 'easy';
    const levels = await levelRepository.loadLevels({ language, category, difficulty: diff });
    return { levels };
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
