// src/features/word-choice-game/engine.ts
import type { Language, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

export interface WordChoiceLevel {
  id: string;
  image: string;
  sound: string;
  solution: string;
  options: string[];
}

interface LevelModule {
  default?: { levels?: unknown[] };
}

class WordChoiceGameEngine implements IGameEngine<WordChoiceLevel> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<WordChoiceLevel[]> {
    const { language, categories } = options;
    const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
    const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
        const path = `/src/data/${categoryTitleCase}/${language}/word-choice/data.json`;
        const modules = import.meta.glob('/src/data/**/*.json');
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`Module not found for path: ${path}`);
          return [];
        }

        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || [];

        return levels.map((lvl: unknown): WordChoiceLevel | null => {
          if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl && 'options' in lvl && Array.isArray(lvl.options)) {
            
            // FIX: Ensure the solution is always part of the options list.
            // Use a Set to automatically handle duplicates if the solution was already in the options.
            const finalOptions = new Set(lvl.options as string[]);
            finalOptions.add(lvl.solution as string);

            return {
              id: String(lvl.id),
              image: String(lvl.image),
              sound: String(lvl.sound),
              solution: String(lvl.solution),
              // Convert the Set back to an array for the level object.
              options: Array.from(finalOptions),
            };
          }
          return null;
        }).filter((l): l is WordChoiceLevel => l !== null);
      } catch (err) {
        console.error(`WordChoiceGameEngine: Failed to load levels for ${language}/${cat}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      return [{
        id: 'error-level',
        image: '/assets/images/error.png',
        sound: '',
        solution: 'ERROR',
        options: ['Error', 'Loading', 'Failed'],
      }];
    }
    return shuffleArray(allLevels);
  }
}

export const wordChoiceGameEngine = new WordChoiceGameEngine();
