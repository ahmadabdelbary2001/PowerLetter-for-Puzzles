export const DIFFICULTY_SETTINGS = {
  easy: { totalLetters: 10 },
  medium: { totalLetters: 14 },
  hard: { totalLetters: 20 }
};

type LanguageCode = 'en' | 'ar';

type Difficulty = keyof typeof DIFFICULTY_SETTINGS;

/**
 * Generate an array of random letters, excluding any in excludeLetters.
 */
export function generateRandomLetters(
  count: number,
  excludeLetters: string[] = [],
  language: LanguageCode = 'en'
): string[] {
  const alphabets: Record<LanguageCode, string> = {
    en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    ar: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'
  };
  const alphabet = alphabets[language] || alphabets.en;
  const pool = alphabet.split('').filter(letter => !excludeLetters.includes(letter));

  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
  }
  return result;
}

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Generate the full letter set for a level: solution letters + extra random letters, shuffled.
 */
export function generateLetters(
  solution: string,
  difficulty: Difficulty,
  language: LanguageCode = 'en'
): string[] {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const solutionLetters = solution.replace(/\s/g, '').split('');
  const extraCount = settings.totalLetters - solutionLetters.length;

  const extra = generateRandomLetters(extraCount, solutionLetters, language);
  return shuffleArray([...solutionLetters, ...extra]);
}

/**
 * Calculate a score based on difficulty and number of hints used.
 */
export function calculateScore(
  difficulty: Difficulty,
  hintsUsed: number = 0
): number {
  const base: Record<Difficulty, number> = {
    easy: 10,
    medium: 20,
    hard: 30
  };
  const score = (base[difficulty] || 10) - hintsUsed * 2;
  return Math.max(1, score);
}

/**
 * Load levels JSON for the given language.
 */
export async function loadLevels(
  language: LanguageCode
): Promise<{
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}[]> {
  try {
    const module =
      language === 'ar'
        ? await import('@/data/ar/clueLevels.json')
        : await import('@/data/en/clueLevels.json');
    const levels = module.default?.levels || module.levels || [];
    
    // Validate and cast difficulty
    return levels.map(level => {
      const difficulty = level.difficulty;
      if (!['easy', 'medium', 'hard'].includes(difficulty)) {
        console.warn(`Invalid difficulty "${difficulty}" found in level data, defaulting to "easy"`);
        return { ...level, difficulty: 'easy' as Difficulty };
      }
      return { ...level, difficulty: difficulty as Difficulty };
    });
  } catch (err) {
    console.error('Failed to load levels:', err);
    return [];
  }
}

