// src/features/img-clue-game/engine/index.ts
import type { Language, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';

export interface ImageLevel {
  id: string;
  difficulty: 'easy';
  image: string;
  sound: string;
  solution: string;
}

export function generateLetters(solution: string, language: Language): string[] {
  const solutionLetters = solution.replace(/\s/g, "").split('');
  const settings = { totalLetters: 10 }; // Simplified for kids
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);

  let alphabet: string[] = [];
  if (language === 'ar') {
    alphabet = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  } else {
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
  }

  const extraLetters = Array.from({ length: extraCount }, () => alphabet[Math.floor(Math.random() * alphabet.length)]);
  const allLetters = [...solutionLetters, ...extraLetters];
  
  return shuffleArray(allLetters);
}

export async function loadImageClueLevels(
  language: Language,
  categories: GameCategory[]
): Promise<ImageLevel[]> {
  const ALL_KIDS_CATEGORIES: GameCategory[] = ['animals', 'fruits', 'shapes'];
  // FIX: Changed 'let' to 'const' as suggested by the linter
  const categoriesToLoad = categories.includes('general') ? ALL_KIDS_CATEGORIES : categories;

  const allLevels: ImageLevel[] = [];

  const promises = categoriesToLoad.map(async (cat) => {
    try {
      const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
      const path = `/src/data/${categoryTitleCase}/${language}/image-clue/data.json`;
      
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      if (!moduleLoader) {
        console.warn(`ImgClueEngine: Module not found for path: ${path}`);
        return [];
      }

      const module = (await moduleLoader()) as { default?: { levels?: unknown[] } };
      const levels = module.default?.levels || [];

      return levels.map((lvl: unknown): ImageLevel | null => {
        if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl) {
          return {
            id: String(lvl.id),
            difficulty: 'easy',
            image: String(lvl.image),
            sound: String(lvl.sound),
            solution: String(lvl.solution),
          };
        }
        return null;
      }).filter((l): l is ImageLevel => l !== null);

    } catch (err) {
      console.error(`ImgClueEngine: Failed to load levels for ${language}/${cat}.`, err);
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach(levelSet => allLevels.push(...levelSet));

  if (allLevels.length === 0) {
    return [{
      id: 'error-level',
      difficulty: 'easy',
      image: '/assets/images/error.png',
      sound: '',
      solution: 'ERROR'
    }];
  }

  return shuffleArray(allLevels);
}
