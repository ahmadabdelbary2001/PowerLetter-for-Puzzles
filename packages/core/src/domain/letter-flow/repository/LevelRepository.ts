// src/domain/letter-flow/repository/LevelRepository.ts
/**
 * Repository for loading Letter Flow levels.
 * Uses static imports to support both Vite and Webpack (Next.js) bundlers.
 * Dynamic import() with string templates breaks in Webpack — this is the fix.
 */

import type { Language, Difficulty, GameCategory } from '../../../types/game';
import type { LevelModule } from '../model';

// ── Static imports: Webpack requires fully-static import paths ───────────────
import arEasy   from '../../../data/ar/letter-flow/easy.json';
import arMedium from '../../../data/ar/letter-flow/medium.json';
import enEasy   from '../../../data/en/letter-flow/easy.json';
import enMedium from '../../../data/en/letter-flow/medium.json';

type LevelFile = { levels: unknown[] };

// ── Level lookup map ─────────────────────────────────────────────────────────
const LEVEL_MAP: Partial<Record<Language, Partial<Record<Difficulty, LevelFile>>>> = {
  ar: {
    easy:   arEasy   as LevelFile,
    medium: arMedium as LevelFile,
    hard:   arMedium as LevelFile, // fallback to medium until hard exists
  },
  en: {
    easy:   enEasy   as LevelFile,
    medium: enMedium as LevelFile,
    hard:   enMedium as LevelFile, // fallback to medium until hard exists
  },
};

export interface LoadOptions {
  language: Language;
  category?: GameCategory;
  difficulty?: Difficulty;
}

export class LevelRepository {
  /**
   * Synchronously resolve a level file from the static map.
   * Falls back: hard → medium → easy → empty.
   */
  private resolve(language: Language, difficulty: Difficulty = 'easy'): LevelFile {
    const langMap = LEVEL_MAP[language] ?? LEVEL_MAP['ar']!;
    return langMap[difficulty] ?? langMap['easy'] ?? { levels: [] };
  }

  /**
   * Load level module for specific language and difficulty.
   * Returns a promise for backward compatibility.
   */
  async loadModule(
    language: Language,
    difficulty: Difficulty = 'easy'
  ): Promise<LevelModule> {
    const file = this.resolve(language, difficulty);
    return file as unknown as LevelModule;
  }

  /**
   * Load all levels for given options.
   */
  async loadLevels(options: LoadOptions): Promise<unknown[]> {
    const { language, difficulty = 'easy' } = options;
    const file = this.resolve(language, difficulty);

    if (!file.levels || file.levels.length === 0) {
      console.warn(`LevelRepository: No levels found for ${language}/${difficulty}.`);
      return [];
    }

    return file.levels;
  }

  /** No-op: static imports need no cache management */
  clearCache(): void {}
}

// Singleton instance
export const levelRepository = new LevelRepository();
