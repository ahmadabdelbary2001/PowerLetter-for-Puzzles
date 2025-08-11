// src/features/clue-game/engine/index.ts
export type LanguageCode = 'en' | 'ar';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}

/**
 * Per-game difficulty settings (total letters shown on the board).
 * Keep this local to the Clue engine so different games can have different settings.
 */
export const DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 12 },
  medium: { totalLetters: 18 },
  hard: { totalLetters: 24 },
};

/**
 * Basic Arabic normalization (conservative).
 * Remove common diacritics and normalize some hamza/tā' forms.
 * Tweak this to match your wordlist preprocessing.
 */
function normalizeArabic(text: string) {
  return text
    .normalize('NFC')
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '') // diacritics
    .replace(/[إأآ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه'); // optional mapping
}

/** Normalize a single letter to canonical form for this engine. */
export function normalizeLetter(letter: string, lang: LanguageCode) {
  if (lang === 'ar') return normalizeArabic(letter).trim();
  return letter.toLocaleUpperCase();
}

/**
 * Build the letters to display for a level: solution letters + extra random letters, shuffled.
 * This uses two small helpers from shared lib: generateRandomLetters and shuffleArray (imported).
 */
import { generateRandomLetters, shuffleArray } from '@/lib/gameUtils';

export function generateLetters(
  solution: string,
  difficulty: Difficulty,
  language: LanguageCode = 'en'
): string[] {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  const normalizedSolution =
    language === 'ar' ? normalizeArabic(solution) : solution.toLocaleUpperCase();

  const solutionLetters = normalizedSolution.replace(/\s/g, '').split('').map(ch => normalizeLetter(ch, language));

  // ensure we never ask for negative extras
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);

  const extra = generateRandomLetters(extraCount, solutionLetters, language).map(l => normalizeLetter(l, language));
  return shuffleArray([...solutionLetters, ...extra]);
}

/**
 * Load levels JSON for the given language.
 * Keeps format-guarding and returns Level[].
 */
export async function loadLevels(language: LanguageCode): Promise<Level[]> {
  try {
    let module: { default?: { levels?: unknown[] }, levels?: unknown[] };
    if (language === 'ar') {
      module = await import('@/data/ar/clueLevels.json');
    } else {
      module = await import('@/data/en/clueLevels.json');
    }
    const levels = module.default?.levels || module.levels || [];
    // validate/cast difficulty
    return levels.map((lvl: unknown) => {
      // Type guard to ensure lvl is an object with expected properties
      if (typeof lvl === 'object' && lvl !== null) {
        const levelObj = lvl as Record<string, unknown>;
        const difficulty = (['easy', 'medium', 'hard'].includes(String(levelObj.difficulty)) ? String(levelObj.difficulty) : 'easy') as Difficulty;
        return {
          id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2,8)}`),
          clue: String(levelObj.clue ?? ''),
          solution: String(levelObj.solution ?? ''),
          difficulty,
        } as Level;
      }
      // Fallback if lvl is not an object
      const difficulty: Difficulty = 'easy';
      return {
        id: `${difficulty}-${Math.random().toString(36).slice(2,8)}`,
        clue: '',
        solution: '',
        difficulty,
      } as Level;
    });
  } catch (err) {
    console.error('Clue engine: failed to load levels', err);
    return [];
  }
}
