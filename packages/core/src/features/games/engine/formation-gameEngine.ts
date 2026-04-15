// src/features/formation-game/engine.ts
/**
 * @description Game engine for the Word Formation (Crossword) Challenge.
 * This engine handles loading levels and generating letter sets for the game.
 * --- Refactored to use Domain Services from FSD architecture ---
 */
import type { Language, Difficulty, GameCategory } from '@powerletter/core';
// Re-export types from model for backward compatibility
export type { GridCell, FormationLevel } from '@core/entities/model/Formation';
import type { GridCell, FormationLevel } from '@core/entities/model/Formation';

import { BaseGameEngine } from './BaseGameEngine';
import type { LevelModule } from './BaseGameEngine';

import { formationRepository as levelRepository } from '@core/entities/repository/FormationRepository';
import { formationWordService as wordService } from '@core/entities/service/FormationWordService';
import { formationValidationService as validationService } from '@core/entities/service/FormationValidationService';

/**
 * Implements the game engine for the Word Formation (Crossword) Challenge.
 * --- Now extends BaseGameEngine. ---
 */
class FormationGameEngine extends BaseGameEngine<FormationLevel> {
  /**
   * Override base `loadLevels` to use domain repository
   * @param options - Configuration options for loading levels
   * @returns Promise<FormationLevel[]> - Array of loaded levels
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[]; // Kept for interface consistency, but unused.
    difficulty?: Difficulty;
  }): Promise<FormationLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return [];

    try {
      // Use domain repository for loading
      const levels = await levelRepository.loadLevels({ 
        language: language as string, 
        difficulty 
      });

      // Transform and validate each level
      const validatedLevels = levels
        .map((lvl: unknown) => this.validateLevel(lvl, difficulty))
        .filter((l: FormationLevel | null): l is FormationLevel => l !== null);

      return validatedLevels.length > 0 ? validatedLevels : [];

    } catch (err) {
      console.error(`FormationGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [validationService.createErrorLevel()];
    }
  }

  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'formation';
  }

  protected loadModule(language: Language, _: GameCategory, difficulty?: Difficulty): Promise<LevelModule> {
    // Delegate to domain repository
    return levelRepository.loadModule(language, difficulty) as Promise<LevelModule>;
  }

  protected validateLevel(levelData: unknown, difficulty?: Difficulty): FormationLevel | null {
    const lvl = levelData as Record<string, unknown>;
    // Check if the level has the required properties
    if (
      lvl && typeof lvl === 'object' &&
      'id' in lvl && 'words' in lvl && Array.isArray(lvl.words) &&
      'grid' in lvl && 'baseLetters' in lvl
    ) {
      return {
        id: String(lvl.id),
        difficulty: difficulty ?? 'easy', // Assign difficulty from context
        words: lvl.words as string[],
        grid: lvl.grid as GridCell[],
        baseLetters: String(lvl.baseLetters),
        solution: (lvl.words as string[])[0] || '', // Use first word as solution
      };
    }
    return null; // Skip invalid levels
  }

  protected getErrorLevel(): FormationLevel {
    return validationService.createErrorLevel();
  }

  /**
   * Generates a shuffled array of letters from the base letters.
   * Delegates to domain wordService.
   * @param baseLetters - The base set of letters to shuffle
   * @returns string[] - Shuffled array of letters
   */
  public generateLetters(baseLetters: string): string[] {
    if (!baseLetters) return [];
    // Delegate to domain service
    return wordService.generateLetters(baseLetters);
  }
}

// Export a singleton instance of the game engine
export const formationGameEngine = new FormationGameEngine();
