// src/domain/formation/repository/LevelRepository.ts
/**
 * Repository for loading Formation levels
 * Uses static imports to support both Vite and Webpack (Next.js)
 */

import type { Language, Difficulty } from '../../../types/game';
import type { LevelLoadOptions } from '../model';

// ── Static imports for Webpack compatibility ─────────────────────────────────
import arEasy from '../../../data/ar/formation/easy.json';
import arHard from '../../../data/ar/formation/hard.json';
import enEasy from '../../../data/en/formation/easy.json';

type LevelFile = { levels: unknown[] };

const LEVEL_MAP: Partial<Record<Language, Partial<Record<Difficulty, LevelFile>>>> = {
  ar: {
    easy: arEasy as LevelFile,
    medium: arHard as LevelFile, // fallback to hard
    hard: arHard as LevelFile,
  },
  en: {
    easy: enEasy as LevelFile,
    medium: enEasy as LevelFile, // fallback to easy until created
    hard: enEasy as LevelFile, // fallback to easy until created
  },
};

export class LevelRepository {
  /**
   * Synchronously resolve level file
   * Falls back: hard → medium → easy → empty
   */
  private resolve(language: Language, difficulty: Difficulty = 'easy'): LevelFile {
    const langMap = LEVEL_MAP[language] ?? LEVEL_MAP['ar']!;
    return langMap[difficulty] ?? langMap['easy'] ?? { levels: [] };
  }

  /**
   * Load level module (async for compatibility)
   */
  async loadModule(language: Language, difficulty: Difficulty = 'easy'): Promise<LevelFile> {
    return this.resolve(language, difficulty);
  }

  /**
   * Load all levels for given options
   */
  async loadLevels(options: LevelLoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    const file = this.resolve(language as Language, difficulty);

    if (!file.levels || file.levels.length === 0) {
      console.warn(`LevelRepository: No levels found for ${language}/${difficulty}.`);
      return [];
    }

    return file.levels;
  }

  /** No-op: static imports need no cache */
  clearCache(): void {}
}

// Singleton instance
export const levelRepository = new LevelRepository();
