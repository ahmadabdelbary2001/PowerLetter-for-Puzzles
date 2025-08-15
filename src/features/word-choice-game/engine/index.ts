// src/features/word-choice-game/engine/index.ts
import type { Language, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';

// Interface for Word Choice levels
export interface WordChoiceLevel {
  id: string;
  image: string;
  sound: string;
  solution: string;
  options: string[]; // An array of incorrect words
}

/**
 * Load levels for the "Find the Word" game.
 * Handles the 'general' category by fetching from all other kids' categories.
 */
export async function loadWordChoiceLevels(
  language: Language,
  categories: GameCategory[]
): Promise<WordChoiceLevel[]> {
  const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
  const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

  const allLevels: WordChoiceLevel[] = [];

  const promises = categoriesToLoad.map(async (cat) => {
    try {
      const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
      const path = `/src/data/${categoryTitleCase}/${language}/word-choice/data.json`;
      
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      if (!moduleLoader) {
        console.warn(`WordChoiceEngine: Module not found for path: ${path}`);
        return [];
      }

      const module = (await moduleLoader()) as { default?: { levels?: unknown[] } };
      const levels = module.default?.levels || [];

      return levels.map((lvl: unknown): WordChoiceLevel | null => {
        if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl && 'options' in lvl && Array.isArray(lvl.options)) {
          return {
            id: String(lvl.id),
            image: String(lvl.image),
            sound: String(lvl.sound),
            solution: String(lvl.solution),
            options: lvl.options as string[],
          };
        }
        return null;
      }).filter((l): l is WordChoiceLevel => l !== null);

    } catch (err) { // FIX: Correctly formatted catch block
      console.error(`WordChoiceEngine: Failed to load levels for ${language}/${cat}.`, err);
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach((levelSet: WordChoiceLevel[]) => { // FIX: Added type for levelSet
    allLevels.push(...levelSet);
  });

  if (allLevels.length === 0) {
    return [{
      id: 'error-level',
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR',
      options: ['Error', 'Loading', 'Failed']
    }];
  }

  return shuffleArray(allLevels);
}
