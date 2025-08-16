// src/lib/gameEngineUtils.ts
import { shuffleArray } from './gameUtils';
import type { Difficulty } from '@/types/game';

// Difficulty settings for different game types
export const DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 12 },
  medium: { totalLetters: 18 },
  hard: { totalLetters: 24 },
};

// Special difficulty settings for kids games (all use easy settings)
export const KIDS_DIFFICULTY_SETTINGS: Record<Difficulty, { totalLetters: number }> = {
  easy: { totalLetters: 10 },
  medium: { totalLetters: 10 },
  hard: { totalLetters: 10 },
};

/**
 * Generate letters for a word game based on the solution and difficulty
 * @param solution The solution word/phrase
 * @param difficulty The difficulty level
 * @param isKidsGame Whether this is a kids game (uses different difficulty settings)
 * @returns An array of letters including the solution letters and random additional letters
 */
export function generateLetters(
  solution: string, 
  difficulty: Difficulty = 'easy', 
  isKidsGame: boolean = false
): string[] {
  const solutionLetters = solution.replace(/\s/g, '').split('');
  const settings = isKidsGame ? KIDS_DIFFICULTY_SETTINGS[difficulty] : DIFFICULTY_SETTINGS[difficulty];
  const letters = [...solutionLetters];
  const total = Math.max(settings.totalLetters, solutionLetters.length);
  const extraCount = Math.max(0, total - solutionLetters.length);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (let i = 0; i < extraCount; i++) {
    letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  }
  return shuffleArray(letters);
}
