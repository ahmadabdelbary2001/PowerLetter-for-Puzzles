// src/features/img-clue-game/engine.ts
import type { Language, GameCategory, Difficulty } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

export interface ImageLevel {
  id: string;
  image: string;
  sound: string;
  solution: string;
}

interface LevelModule {
  default?: { levels?: unknown[] };
}

class ImgClueGameEngine implements IGameEngine<ImageLevel> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
  }): Promise<ImageLevel[]> {
    const { language, categories } = options;
    const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
    const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
        const path = `/src/data/${categoryTitleCase}/${language}/image-clue/data.json`;
        const modules = import.meta.glob('/src/data/**/*.json');
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`Module not found for path: ${path}`);
          return [];
        }

        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || [];

        return levels.map((lvl: unknown): ImageLevel | null => {
          if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl) {
            return {
              id: String(lvl.id),
              image: String(lvl.image),
              sound: String(lvl.sound),
              solution: String(lvl.solution),
            };
          }
          return null;
        }).filter((l): l is ImageLevel => l !== null);
      } catch (err) {
        console.error(`ImgClueGameEngine: Failed to load levels for ${language}/${cat}.`, err);
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
        solution: 'ERROR'
      }];
    }
    return shuffleArray(allLevels);
  }

  // FIX: The signature now requires a language parameter.
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    return generateLetters(solution, difficulty, language, true); // isKidsMode is true
  }
}

export const imgClueGameEngine = new ImgClueGameEngine();
