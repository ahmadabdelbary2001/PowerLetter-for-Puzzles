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

interface LevelModule {
  default?: {
    id?: string;
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

    // Explicit typing for import.meta.glob map
    const modules = import.meta.glob('/src/data/**/outside-the-story/*.json') as Record<string, () => Promise<LevelModule>>;
    const results: OutsideStoryLevel[] = [];

    for (const cat of categories) {
      const path = `/src/data/${language}/outside-the-story/${language}-outside-the-story-${cat}.json`;
      const loader = modules[path];

      if (!loader) {
        // fallback: try to find any file that matches category+language
        const fallbackKey = Object.keys(modules).find(k => k.includes(`/${language}/outside-the-story/`) && k.includes(`outside-the-story-${cat}`));
        if (!fallbackKey) continue;
        const module = await modules[fallbackKey]();
        const words = Array.isArray(module.default?.words) ? module.default!.words.map(String) : [];
        results.push({
          id: module.default?.id ?? `${language}-${cat}`,
          language,
          category: cat,
          words,
          meta: module.default?.meta ?? {},
        });
        continue;
      }

      try {
        const module = await loader();
        const words = Array.isArray(module.default?.words) ? module.default!.words.map(String) : [];
        results.push({
          id: module.default?.id ?? `${language}-${cat}`,
          language,
          category: cat,
          words,
          meta: module.default?.meta ?? {},
        });
      } catch (err) {
        // If a file fails to load, log and continue
        console.error(`OutsideStoryGameEngine: Failed to load ${path}`, err);
      }
    }

    return results;
  }
}

export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
