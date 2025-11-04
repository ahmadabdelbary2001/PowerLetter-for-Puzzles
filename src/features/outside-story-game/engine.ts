// src/features/outside-story-game/engine.ts
import type { Language, GameCategory } from '@/types/game';
import type { IGameEngine } from '@/games/engine/types';

export interface OutsideStoryLevel {
  id: string;
  language: Language;
  category: GameCategory;
  words: string[];
  meta?: Record<string, unknown>;
}

// Defines the expected structure of the dynamically imported JSON modules.
interface LevelModule {
  default?: {
    category?: GameCategory; // The category name inside the JSON
    words?: unknown[];
    meta?: Record<string, unknown>;
  };
}

class OutsideStoryGameEngine implements IGameEngine<OutsideStoryLevel> {
  /**
   * Loads levels (word lists) for the outside-the-story game.
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<OutsideStoryLevel[]> {
    const { language, categories } = options;

    // The glob pattern remains the same, as it matches all JSON files in the directory.
    const modules = import.meta.glob('/src/data/**/outside-the-story/*.json') as Record<string, () => Promise<LevelModule>>;
    const results: OutsideStoryLevel[] = [];

    for (const cat of categories) {
      // --- CRITICAL FIX ---
      // The path is updated to match the new, simpler file naming convention.
      // e.g., from "/src/data/ar/outside-the-story/ar-outside-the-story-animals.json"
      // to "/src/data/ar/outside-the-story/animals.json"
      const path = `/src/data/${language}/outside-the-story/${cat}.json`;
      
      const loader = modules[path];

      if (!loader) {
        // If the expected file doesn't exist, log a warning and skip it.
        console.warn(`OutsideStoryGameEngine: Could not find data file at path: ${path}`);
        continue;
      }

      try {
        const module = await loader();
        // Ensure the loaded module and its 'words' property are valid.
        const words = Array.isArray(module.default?.words) ? module.default.words.map(String) : [];
        
        results.push({
          id: `${language}-${cat}`, // Generate a consistent ID.
          language,
          category: cat,
          words,
          meta: module.default?.meta ?? {},
        });
      } catch (err) {
        // If a file fails to load for any reason, log the error and continue.
        console.error(`OutsideStoryGameEngine: Failed to load or parse ${path}`, err);
      }
    }

    return results;
  }
}

export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
