// src/features/outside-story-game/engine.ts
/**
 * @description Game engine for the "Outside the Story" game.
 * This engine is responsible for loading lists of words for each selected category.
 * --- It now extends the BaseGameEngine for architectural consistency,
 * simplifying its implementation by inheriting the core level-loading loop. ---
 */
import type { Language, GameCategory, GameLevel } from '@/types/game';
import { BaseGameEngine } from '@/games/engine/BaseGameEngine';

/**
 * Represents a "level" in the Outside the Story game, which is essentially
 * a collection of words for a specific category.
 */
export interface OutsideStoryLevel extends GameLevel {
  id: string;
  language: Language;
  category: GameCategory;
  words: string[];
  meta?: Record<string, unknown>;
}

/**
 * Defines the expected structure of the dynamically imported JSON modules.
 * (This is a shared convention across engines).
 */
interface LevelModule {
  default?: {
    category?: GameCategory; // The category name inside the JSON
    words?: unknown[];
    meta?: Record<string, unknown>;
  };
}

/**
 * Implements the game engine for the Outside the Story game.
 * --- Now extends BaseGameEngine. ---
 */
class OutsideStoryGameEngine extends BaseGameEngine<OutsideStoryLevel> {
  // --- Implementation of abstract methods from BaseGameEngine ---

  protected getGameId(): string {
    return 'outside-the-story';
  }

  protected getModulePath(language: Language, category: GameCategory): string {
    // The path for this game is based on the category name.
    return `/src/data/${language}/outside-the-story/${category}.json`;
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
    const modules = import.meta.glob('/src/data/**/outside-the-story/*.json') as Record<string, () => Promise<LevelModule>>;
    const results: OutsideStoryLevel[] = [];

    // Manually iterate because we are not processing a `levels` array inside the JSON.
    for (const cat of categories) {
      const path = `/src/data/${language}/outside-the-story/${cat}.json`;
      const loader = modules[path];

      if (!loader) {
        console.warn(`OutsideStoryGameEngine: Could not find data file at path: ${path}`);
        continue;
      }

      try {
        const module = await loader();
        const words = Array.isArray(module.default?.words) ? module.default.words.map(String) : [];
        
        results.push({
          id: `${language}-${cat}`, // Generate a consistent ID.
          language,
          category: cat,
          words,
          meta: module.default?.meta ?? {},
        });
      } catch (err) {
        console.error(`OutsideStoryGameEngine: Failed to load or parse ${path}`, err);
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
    };
  }
}

// Export a singleton instance of the engine.
export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
