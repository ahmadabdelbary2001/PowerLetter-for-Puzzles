// src/lib/gameUtils.ts
import type { Difficulty, Language } from '@/types/game';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm and returns it.
 * @param array The array to shuffle.
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- Letter Generation Logic ---

const DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 12 },
  medium: { totalLetters: 18 },
  hard: { totalLetters: 24 },
};

const KIDS_DIFFICULTY_SETTINGS = {
  totalLetters: 10,
};

const ALPHABETS: Record<Language, string> = {
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ar: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
};

/**
 * A centralized function to generate letters for any game grid.
 * It supports different difficulties and languages.
 *
 * @param solution The solution word.
 * @param difficulty The difficulty of the level.
 * @param language The language of the letters to generate.
 * @param isKidsMode If true, uses simpler settings for letter count.
 * @returns An array of shuffled letters.
 */
export function generateLetters(
  solution: string,
  difficulty: Difficulty,
  language: Language,
  isKidsMode = false
): string[] {
  const solutionLetters = solution.replace(/\s/g, '').split('');
  const settings = isKidsMode ? KIDS_DIFFICULTY_SETTINGS : DIFFICULTY_SETTINGS[difficulty];
  
  const letters = [...solutionLetters];
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);
  
  const alphabet = ALPHABETS[language] || ALPHABETS.en;

  for (let i = 0; i < extraCount; i++) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }

  return shuffleArray(letters);
}
