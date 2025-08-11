// src/lib/gameUtils.ts
type LanguageCode = 'en' | 'ar';

/**
 * Small shared helpers used across features.
 * Keep generic helpers here so engine modules can import them.
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

/** Fisher–Yates shuffle (returns new array) */
export function shuffleArray<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
