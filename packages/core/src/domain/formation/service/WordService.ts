// src/domain/formation/service/WordService.ts
/**
 * Service for word-related operations
 */

import type { FormationLevel, WordValidationResult } from '../model';

export class WordService {
  /**
   * Check if word exists in level's word list
   */
  validateWord(word: string, level: FormationLevel): boolean {
    const normalized = word.trim().toLowerCase();
    return level.words.some(w => w.toLowerCase() === normalized);
  }

  /**
   * Check if word was already found
   */
  isAlreadyFound(word: string, foundWords: Set<string>): boolean {
    return foundWords.has(word.toLowerCase());
  }

  /**
   * Check if input can be formed from available letters
   */
  canFormWord(input: string, availableLetters: string[]): boolean {
    const inputChars = input.split('');
    const available = [...availableLetters];

    for (const ch of inputChars) {
      const idx = available.findIndex(a => a === ch);
      if (idx === -1) return false;
      available.splice(idx, 1);
    }
    return true;
  }

  /**
   * Validate word attempt with full error reporting
   */
  validateWordAttempt(
    word: string,
    level: FormationLevel,
    foundWords: Set<string>,
    availableLetters: string[]
  ): WordValidationResult {
    // Check if already found
    if (this.isAlreadyFound(word, foundWords)) {
      return { isValid: false, error: 'alreadyFound' };
    }

    // Check if can be formed from letters
    if (!this.canFormWord(word, availableLetters)) {
      return { isValid: false, error: 'lettersNotAvailable' };
    }

    // Check if valid word in level
    if (!this.validateWord(word, level)) {
      return { isValid: false, error: 'wordNotFound' };
    }

    return { isValid: true };
  }

  /**
   * Shuffle letters array
   */
  shuffleLetters(letters: string[]): string[] {
    const shuffled = [...letters];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generate letters from base string
   */
  generateLetters(baseLetters: string): string[] {
    if (!baseLetters) return [];
    return this.shuffleLetters(baseLetters.split(''));
  }
}

// Singleton instance
export const wordService = new WordService();
