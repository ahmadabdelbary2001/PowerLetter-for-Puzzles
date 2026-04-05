// src/features/outside-story-game/engine.ts
/**
 * @description Game engine for the "Outside the Story" game.
 * This engine is responsible for loading lists of words for each selected category.
 * --- It now extends the BaseGameEngine for architectural consistency,
 * simplifying its implementation by inheriting the core level-loading loop. ---
 */
import type { Language, GameCategory, GameLevel } from '@powerletter/core';
import { BaseGameEngine } from '../../games/engine/BaseGameEngine';

/**
 * Represents a "level" in the Outside the Story game, which is essentially
 * a collection of words for a specific category.
 */
export interface OutsideStoryLevel extends GameLevel {
  id: string;
  language: Language;
  category: GameCategory;
  words: string[];
  solution: string;
  meta?: Record<string, unknown>;
}

import type { LevelModule } from '../../games/engine/BaseGameEngine';

/**
 * Implements the game engine for the Outside the Story game.
 * --- Now extends BaseGameEngine. ---
 */
class OutsideStoryGameEngine extends BaseGameEngine<OutsideStoryLevel> {
  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'outside-the-story';
  }

  protected loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    return import(`../../data/${language}/outside-the-story/${category}.json`);
  }

  protected validateLevel(): OutsideStoryLevel | null {
    // This game's "level" is the entire file content, not an item in a `levels` array.
    // The base class's `loadLevels` will call this once per file.
    // We will adjust the logic slightly to handle this.
    // For this engine, we'll actually override `loadLevels` to reflect its unique structure.
    // This demonstrates the flexibility of the base class approach.
    return null; // This will be unused as we override loadLevels.
  }

  /**
   * --- This engine's logic is unique as it treats each file as a single "level". ---
   * We override the base `loadLevels` to implement this specific logic directly.
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<OutsideStoryLevel[]> {
    const { language, categories } = options;
    const results: OutsideStoryLevel[] = [];
    // Manually iterate because we are not processing a `levels` array inside the JSON.
    for (const cat of categories) {
      try {
        const module = await this.loadModule(language, cat);
        const moduleDefault = module.default;
        const words = (moduleDefault && Array.isArray(moduleDefault.words)) ? moduleDefault.words.map(String) : [];
        
        // For Outside Story, the first word in the list is the solution
        const solution = words.length > 0 ? words[0] : "";
        
        results.push({
          id: `${language}-${cat}`, // Generate a consistent ID.
          language,
          category: cat,
          words,
          solution,
          meta: moduleDefault?.meta ?? {},
        });
      } catch (err) {
        console.error(`OutsideStoryGameEngine: Failed to load or parse for category ${cat}`, err);
      }
    }

    // If no files were loaded successfully, return an error level.
    if (results.length === 0) {
      return [this.getErrorLevel()];
    }

    return results;
  }

  protected getErrorLevel(): OutsideStoryLevel {
    // Returns a default error level object to prevent crashes.
    return {
      id: 'error',
      language: 'en',
      category: 'general',
      words: ['ERROR'],
      solution: 'ERROR',
    };
  }
}

// Export a singleton instance of the engine.
export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
