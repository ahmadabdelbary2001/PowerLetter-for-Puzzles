// src/features/picture-choice-game/engine.ts
import type { Language, GameCategory, Difficulty } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

export interface PictureChoiceLevel {
  id: string;
  word: string;
  sound?: string;
  solution: string;
  options: string[];
}

interface LevelModule {
  default?: { levels?: unknown[] };
}

class PictureChoiceGameEngine implements IGameEngine<PictureChoiceLevel> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<PictureChoiceLevel[]> {
    const { language, categories } = options;
    const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
    const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

    // loader map: keys -> async loader function
    const modules = import.meta.glob('/src/data/**/*.json') as Record<string, () => Promise<LevelModule>>;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const entries = Object.entries(modules);

        // 1) Try exact language-specific module (preferred)
        const langKey = entries.find(([key]) =>
          key.includes(`/${language}/picture-choice/${cat}/data.json`) ||
          key.includes(`\\${language}\\picture-choice\\${cat}\\data.json`) // windows-safe check, just in case
        )?.[1];

        // 2) Fallback to English explicitly if language not found
        const enKey = entries.find(([key]) =>
          key.includes(`/en/picture-choice/${cat}/data.json`) ||
          key.includes(`\\en\\picture-choice\\${cat}\\data.json`)
        )?.[1];

        // 3) Last-resort: any picture-choice/<cat>/data.json (should be rare)
        const anyKey = entries.find(([key]) =>
          key.endsWith(`/picture-choice/${cat}/data.json`) || key.endsWith(`\\picture-choice\\${cat}\\data.json`)
        )?.[1];

        const entry = langKey ?? enKey ?? anyKey;

        if (!entry) {
          console.warn(`PictureChoiceGameEngine: no module found for ${language}/${cat}`);
          return [] as PictureChoiceLevel[];
        }

        const module = (await entry()) as LevelModule;
        const rawLevels = module.default?.levels ?? [];

        const validated = rawLevels
          .map((lvl): PictureChoiceLevel | null => {
            if (typeof lvl !== 'object' || lvl === null) return null;
            const obj = lvl as Record<string, unknown>;

            const id = obj.id;
            const word = obj.word;
            const solution = obj.solution;
            const options = obj.options;
            const sound = obj.sound;

            if (
              (typeof id === 'string' || typeof id === 'number') &&
              typeof word === 'string' &&
              typeof solution === 'string' &&
              Array.isArray(options) &&
              options.every((o) => typeof o === 'string')
            ) {
              const finalOptions = Array.from(new Set(options.map(String)));
              if (!finalOptions.includes(solution)) finalOptions.push(solution);

              return {
                id: String(id),
                word: String(word),
                sound: typeof sound === 'string' ? String(sound) : '',
                solution: String(solution),
                options: finalOptions,
              };
            }
            return null;
          })
          .filter((x): x is PictureChoiceLevel => x !== null);

        return validated;
      } catch (err) {
        console.error(`PictureChoiceGameEngine: Failed to load ${language}/${cat}`, err);
        return [] as PictureChoiceLevel[];
      }
    });

    const results = await Promise.all(promises);
    const all = results.flat();

    if (all.length === 0) {
      return [
        {
          id: 'error-level',
          word: 'ERROR',
          sound: '',
          solution: '/assets/images/error.png',
          options: ['/assets/images/error.png'],
        },
      ];
    }

    return shuffleArray(all);
  }
}

export const pictureChoiceGameEngine = new PictureChoiceGameEngine();
