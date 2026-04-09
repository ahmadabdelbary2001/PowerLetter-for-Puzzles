// src/features/outside-story-game/engine.ts
/**
 * @description Game engine for the "Outside the Story" game.
 * --- Refactored to use Domain Services from FSD architecture ---
 */
import type { Language, GameCategory } from '@powerletter/core';
// Re-export types from domain for backward compatibility
export type { OutsiderLevel as OutsideStoryLevel } from '../../domain/outside-story';

import { BaseGameEngine } from '../../games/engine/BaseGameEngine';
import type { LevelModule } from '../../games/engine/BaseGameEngine';

// Import domain services
import { levelRepository, ERROR_LEVEL } from '../../domain/outside-story';
import type { OutsiderLevel } from '../../domain/outside-story';

/**
 * Implements the game engine for the Outside the Story game.
 * --- Now extends BaseGameEngine and uses domain services. ---
 */
class OutsideStoryGameEngine extends BaseGameEngine<OutsiderLevel> {
  protected getGameId(): string {
    return 'outside-the-story';
  }

  protected loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    // Kept for backward compatibility - now handled by repository
    return import(`../../data/${language}/outside-the-story/${category}.json`);
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
