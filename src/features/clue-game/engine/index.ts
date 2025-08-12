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
    alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
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
  category: GameCategory,
  difficulty: Difficulty
): Promise<Level[]> {
  const ALL_CATEGORIES: GameCategory[] = ['animals', 'science', 'geography'];

  if (category === 'general') {
    const allGeneralLevels: Level[] = [];
    const promises = ALL_CATEGORIES.map(cat => 
      loadLevels(language, cat, difficulty)
    );
    const results = await Promise.all(promises);
    results.forEach(levelSet => {
      const validLevels = levelSet.filter(lvl => lvl.solution !== 'ERROR');
      allGeneralLevels.push(...validLevels);
    });
    return shuffleArray(allGeneralLevels);
  }

  try {
    const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
    const path = `/src/data/${categoryTitleCase}/${language}/clue/${language}-clue-${category}-${difficulty}.json`;
    
    const modules = import.meta.glob('/src/data/**/*.json');
    const moduleLoader = modules[path];

    if (!moduleLoader) {
      throw new Error(`Module not found for path: ${path}`);
    }

    const module = await moduleLoader() as LevelModule;
    const levels = module.default?.levels || module.levels || [];

    if (levels.length === 0) {
      throw new Error("No 'levels' array found in the JSON file.");
    }

    return levels.map((lvl: unknown): Level => {
      if (typeof lvl === 'object' && lvl !== null) {
        const levelObj = lvl as Record<string, unknown>;
        return {
          id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2,8)}`),
          clue: String(levelObj.clue ?? ''),
          solution: String(levelObj.solution ?? ''),
          difficulty,
        };
      }
      return { id: 'malformed', clue: 'Invalid level format', solution: 'ERROR', difficulty };
    });
  } catch (err) {
    console.error(`Clue engine: failed to load levels for ${language}/${category}/${difficulty}. Error:`, err);
    return [{
      id: 'error-level',
      difficulty: 'easy',
      clue: 'Could not load levels. Please check the file path and content.',
      solution: 'ERROR'
    }];
  }
}
