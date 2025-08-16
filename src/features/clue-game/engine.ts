// src/features/clue-game/engine.ts
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils'; // Import the shared function
import type { IGameEngine } from '@/games/engine/types';

export interface Level {
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}

interface LevelModule {
  default?: { levels?: unknown[] };
  levels?: unknown[];
}

class ClueGameEngine implements IGameEngine<Level> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty: Difficulty;
  }): Promise<Level[]> {
    const { language, categories, difficulty } = options;
    const ALL_CATEGORIES: GameCategory[] = ['animals', 'science', 'geography'];
    // FIX: Use 'const' as this variable is not reassigned.
    const categoriesToLoad = categories.includes('general') ? ALL_CATEGORIES : categories;

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
        const path = `/src/data/${categoryTitleCase}/${language}/clue/${language}-clue-${cat}-${difficulty}.json`;
        const modules = import.meta.glob('/src/data/**/*.json');
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`Module not found for path: ${path}`);
          return [];
        }

        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || module.levels || [];

        return levels.map((lvl: unknown): Level | null => {
          if (typeof lvl === 'object' && lvl !== null) {
            const levelObj = lvl as Record<string, unknown>;
            return {
              id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2, 8)}`),
              clue: String(levelObj.clue ?? ''),
              solution: String(levelObj.solution ?? ''),
              difficulty,
            };
          }
          return null;
        }).filter((l): l is Level => l !== null);
      } catch (err) {
        console.error(`ClueGameEngine: Failed to load levels for ${language}/${cat}/${difficulty}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      return [{
        id: 'error-level',
        difficulty: 'easy',
        clue: 'Could not load levels for the selected categories.',
        solution: 'ERROR'
      }];
    }
    return shuffleArray(allLevels);
  }

  // This engine uses the shared generateLetters function.
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    return generateLetters(solution, difficulty, language, false); // isKidsMode is false
  }
}

export const clueGameEngine = new ClueGameEngine();
