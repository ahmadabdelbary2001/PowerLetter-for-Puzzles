// src/features/formation-game/engine.ts
/**
 * @description Game engine for the Word Formation (Crossword) Challenge.
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';

export interface GridCell {
  x: number;
  y: number;
  letter: string;
  words: number[];
}

export interface FormationLevel {
  id: string;
  difficulty: Difficulty;
  words: string[];
  grid: GridCell[];
  baseLetters: string;
  solution: string; // To satisfy useGame constraint
}

interface LevelModule {
  default?: { levels?: unknown[] };
}

class FormationGameEngine implements IGameEngine<FormationLevel> {
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }): Promise<FormationLevel[]> {
    const { language, difficulty } = options;
    if (!difficulty) return [];

    try {
      const path = `/src/data/${language}/formation/${language}-formation-${difficulty}.json`;
      const modules = import.meta.glob('/src/data/**/*.json');
      const moduleLoader = modules[path];
      if (!moduleLoader) return [];

      const module = (await moduleLoader()) as LevelModule;
      const levels = module.default?.levels || [];

      return levels.map((lvl: unknown): FormationLevel | null => {
        if (
          typeof lvl === 'object' && lvl !== null &&
          'id' in lvl && 'words' in lvl && Array.isArray(lvl.words) &&
          'grid' in lvl && 'baseLetters' in lvl
        ) {
          return {
            id: String(lvl.id),
            difficulty,
            words: lvl.words as string[],
            grid: lvl.grid as GridCell[],
            baseLetters: String(lvl.baseLetters),
            solution: (lvl.words as string[])[0] || '',
          };
        }
        return null;
      }).filter((l): l is FormationLevel => l !== null);
    } catch (err) {
      console.error(`FormationGameEngine: Failed to load levels for ${language}/${difficulty}.`, err);
      return [{ id: 'error', difficulty: 'easy', words: [], grid: [], baseLetters: 'ERROR', solution: '' }];
    }
  }

  public generateLetters(_s: string, _d: Difficulty, _l: Language, baseLetters?: string): string[] {
    if (!baseLetters) return [];
    return shuffleArray(baseLetters.split(''));
  }
}

export const formationGameEngine = new FormationGameEngine();
