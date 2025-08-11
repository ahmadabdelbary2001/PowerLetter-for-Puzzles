// src/features/clue-game/engine/index.ts
import type { Language, Difficulty, GameCategory } from '@/types/game';
export type { Language, Difficulty, GameCategory };

export interface Level {
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}

// Define a type for the structure of the imported JSON module
interface LevelModule {
  default?: {
    levels?: unknown[];
  };
  levels?: unknown[];
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 12 },
  medium: { totalLetters: 18 },
  hard: { totalLetters: 24 },
};

function normalizeArabic(text: string) {
  return text
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '')
    .replace(/[إأآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه');
}

export function normalizeLetterForComparison(letter: string, lang: Language) {
  if (lang === 'ar') return normalizeArabic(letter).trim();
  return letter.toLocaleUpperCase();
}

import { generateRandomLetters, shuffleArray } from '@/lib/gameUtils';

export function generateLetters(
  solution: string,
  difficulty: Difficulty,
  language: Language = 'en'
): string[] {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const solutionLetters = (language === 'en' ? solution.toLocaleUpperCase() : solution)
    .replace(/\s/g, '')
    .split('');
  const normalizedSolutionLetters = solutionLetters.map(ch => normalizeLetterForComparison(ch, language));
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);
  const extra = generateRandomLetters(extraCount, normalizedSolutionLetters, language);
  return shuffleArray([...solutionLetters, ...extra]);
}

export async function loadLevels(
  language: Language,
  category: GameCategory,
  difficulty: Difficulty
): Promise<Level[]> {
  try {
    const categoryTitleCase = category.charAt(0).toUpperCase() + category.slice(1);
    const path = `/src/data/${categoryTitleCase}/${language}/clue/${language}-clue-${category}-${difficulty}.json`;
    
    const modules = import.meta.glob('/src/data/**/*.json');
    const moduleLoader = modules[path];

    if (!moduleLoader) {
      throw new Error(`Module not found for path: ${path}`);
    }

    // FIX: Safely cast the loaded module to the expected type.
    const module = (await moduleLoader()) as LevelModule;
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
