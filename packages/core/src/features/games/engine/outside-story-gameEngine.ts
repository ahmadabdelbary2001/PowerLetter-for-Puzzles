// src/features/outside-story-game/engine.ts
/**
 * @description Game engine for the "Outside the Story" game.
 * --- Refactored to use Domain Services from FSD architecture ---
 */
import type { Language, GameCategory } from '@powerletter/core';
// Re-export types from model for backward compatibility
export type { OutsiderLevel as OutsideStoryLevel } from '@core/entities/model/OutsideStory';
import { OutsiderLevel, OUTSIDE_STORY_ERROR_LEVEL as ERROR_LEVEL } from '@core/entities/model/OutsideStory';

import { BaseGameEngine } from './BaseGameEngine';
import type { LevelModule } from './BaseGameEngine';

// Import FSD entities
import { outsideStoryRepository as levelRepository } from '@core/entities/repository/OutsideStoryRepository';

/**
 * Implements the game engine for the Outside the Story game.
 * --- Now extends BaseGameEngine and uses domain services. ---
 */
class OutsideStoryGameEngine extends BaseGameEngine<OutsiderLevel> {
  protected getGameId(): string {
    return 'outside-the-story';
  }

  protected async loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    // Handled by the repository - return empty to avoid dynamic imports in production build
    const [level] = await levelRepository.loadLevels(language, [category]);
    return { levels: level ? [level] : [] };
  }

  protected validateLevel(): OutsiderLevel | null {
    // Delegated to domain ValidationService
    return null;
  }

  /**
   * Override base `loadLevels` to use domain repository
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<OutsiderLevel[]> {
    const { language, categories } = options;
    
    // Use domain repository for loading
    const results = await levelRepository.loadLevels(language, categories);
    
    // Return error level if nothing loaded
    if (results.length === 0 || (results.length === 1 && results[0].id === 'error')) {
      return [this.getErrorLevel()];
    }

    return results;
  }

  protected getErrorLevel(): OutsiderLevel {
    return ERROR_LEVEL;
  }
}

// Export a singleton instance
export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
