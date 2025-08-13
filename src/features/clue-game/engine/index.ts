// src/features/clue-game/engine/index.ts
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
export type { Language, Difficulty, GameCategory };

export interface Level {
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}

export interface ImageLevel {
  id: string;
  difficulty: 'easy';
  image: string;
  sound: string;
  solution: string;
}

interface LevelModule {
  default?: { levels?: unknown[] };
  levels?: unknown[];
}

// Difficulty settings for letter generation
export const DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 12 },
  medium: { totalLetters: 18 },
  hard: { totalLetters: 24 },
};

// Normalize Arabic characters for comparison purposes
function normalizeArabicForComparison(text: string): string {
  return text
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

// Normalize letters for comparison
function normalizeLetterForComparison(letter: string): string {
  if (/[؀-ۿ]/.test(letter)) {
    return normalizeArabicForComparison(letter);
  }
  return letter.toLowerCase();
}

// Generate letters for the game grid
export function generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
  // FIX: Remove spaces from the solution string before splitting it into letters.
  const solutionLetters = solution.replace(/\s/g, '').split('');
  const settings = DIFFICULTY_SETTINGS[difficulty];

  // Create a frequency map of solution letters
  const frequencyMap: Record<string, number> = {};
  solutionLetters.forEach(letter => {
    const normalized = normalizeLetterForComparison(letter);
    frequencyMap[normalized] = (frequencyMap[normalized] || 0) + 1;
  });

  // Create an array with the valid solution letters (no spaces)
  const letters = [...solutionLetters];

  // Add extra letters based on difficulty
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);

  // Define alphabet based on language
  let alphabet: string[] = [];
  if (language === 'ar') {
    // Arabic alphabet (without spaces)
    alphabet = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  } else {
    // English alphabet (without spaces)
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  // Add random letters
  for (let i = 0; i < extraCount; i++) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    letters.push(randomLetter);
  }

  // Shuffle the letters
  return shuffleArray(letters);
}

/**
 * Load levels JSON dynamically.
 * Handles the special 'general' category by fetching, filtering,
 * and shuffling levels from all other categories.
 */
export async function loadLevels(
  language: Language,
  categories: GameCategory[], // FIX: Accepts an array of categories
  difficulty: Difficulty
): Promise<Level[]> {
  const ALL_CATEGORIES: GameCategory[] = ['animals', 'science', 'geography'];
  let categoriesToLoad = categories;

  // If 'general' is selected, it overrides everything and loads all categories.
  if (categories.includes('general')) {
    categoriesToLoad = ALL_CATEGORIES;
  }

  const allLevels: Level[] = [];

  // Use Promise.all to fetch levels from all selected categories concurrently.
  const promises = categoriesToLoad.map(async (cat) => {
    try {
      const categoryTitleCase = cat.charAt(0).toUpperCase() + cat.slice(1);
      const path = `/src/data/${categoryTitleCase}/${language}/clue/${language}-clue-${cat}-${difficulty}.json`;
      
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];

      if (!moduleLoader) {
        console.warn(`Module not found for path: ${path}`);
        return []; // Return empty array if a category file doesn't exist
      }

      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || module.levels || [];

      return levels.map((lvl: unknown): Level | null => {
        if (typeof lvl === 'object' && lvl !== null) {
          const levelObj = lvl as Record<string, unknown>;
          return {
            id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2,8)}`),
            clue: String(levelObj.clue ?? ''),
            solution: String(levelObj.solution ?? ''),
            difficulty,
          };
        }
        return null;
      }).filter((l): l is Level => l !== null); // Filter out any null (malformed) levels

    } catch (err) {
      console.error(`Clue engine: failed to load levels for ${language}/${cat}/${difficulty}.`, err);
      return []; // Return empty array on error for this category
    }
  });

  const results = await Promise.all(promises);
  
  // Flatten the array of arrays into a single array of levels
  results.forEach(levelSet => {
    allLevels.push(...levelSet);
  });

  // If no levels were found at all, return the error-state level.
  if (allLevels.length === 0) {
    return [{
      id: 'error-level',
      difficulty: 'easy',
      clue: 'Could not load levels for the selected categories. Please check your selection.',
      solution: 'ERROR'
    }];
  }

  // Shuffle the final combined list for a random experience
  return shuffleArray(allLevels);
}

export async function loadImageClueLevels(
  language: Language,
  category: GameCategory
): Promise<ImageLevel[]> {
  try {
    // Example path: /src/data/Animals/en/image-clue/data.json
    const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
    const path = `/src/data/${categoryTitleCase}/${language}/image-clue/data.json`;
    
    const modules = import.meta.glob('/src/data/**/*.json');
    const moduleLoader = modules[path];

    if (!moduleLoader) {
      throw new Error(`Module not found for path: ${path}`);
    }

    const module = (await moduleLoader()) as { default?: { levels?: unknown[] } };
    const levels = module.default?.levels || [];

    if (levels.length === 0) {
      throw new Error("No 'levels' array found in the JSON file.");
    }

    const validatedLevels = levels.map((lvl: unknown): ImageLevel | null => {
      if (typeof lvl === 'object' && lvl !== null && 'id' in lvl && 'image' in lvl && 'sound' in lvl && 'solution' in lvl) {
        return {
          id: String(lvl.id),
          difficulty: 'easy', // Assume all kids levels are easy for now
          image: String(lvl.image),
          sound: String(lvl.sound),
          solution: String(lvl.solution),
        };
      }
      return null;
    }).filter((l): l is ImageLevel => l !== null);

    return shuffleArray(validatedLevels);

  } catch (err) {
    console.error(`ImageClue Engine: failed to load levels for ${language}/${category}. Error:`, err);
    return [{
      id: 'error-level',
      difficulty: 'easy',
      image: '/assets/images/error.png', // A placeholder error image
      sound: '',
      solution: 'ERROR'
    }];
  }
}