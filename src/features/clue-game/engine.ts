// src/features/clue-game/engine.ts
/**
 * Clue Game Engine - Implements game logic for the word clue puzzle game
 * Handles loading levels from JSON files and generating letter options for the player
 */
import type { Language, Difficulty, GameCategory } from '@/types/game';
import { shuffleArray, generateLetters } from '@/lib/gameUtils';
import type { IGameEngine } from '@/games/engine/types';
import { GAME_REGISTRY } from '@/games/GameRegistry'; // NEW: Import the game registry

/**
 * Interface defining the structure of a clue game level
 */
export interface Level {
  id: string;
  difficulty: Difficulty;
  clue: string;
  solution: string;
}

/**
 * Interface for dynamically imported level modules
 */
interface LevelModule {
  default?: { levels?: unknown[] };
  levels?: unknown[];
}

/**
 * Engine class that handles loading and processing clue game levels
 */
class ClueGameEngine implements IGameEngine<Level> {
  /**
   * Loads game levels based on language, categories, and difficulty
   */
  public async loadLevels(options: {
    language: Language;
    categories: GameCategory[];
    difficulty: Difficulty;
  }): Promise<Level[]> {
    const { language, categories, difficulty } = options;

    // --- Dynamically determine categories instead of hardcoding them. ---
    let categoriesToLoad: GameCategory[];

    if (categories.includes('general')) {
      // If 'general' is selected, get ALL available categories for the 'clue' game from the registry.
      const clueGameConfig = GAME_REGISTRY.find(game => game.id === 'clue');
      // Filter out 'general' itself to avoid trying to load a 'general.json' file.
      categoriesToLoad = clueGameConfig?.availableCategories?.filter(cat => cat !== 'general') ?? [];
    } else {
      // Otherwise, just load the specifically selected categories.
      categoriesToLoad = categories;
    }

    const modules = import.meta.glob('/src/data/**/*.json');

    const promises = categoriesToLoad.map(async (cat) => {
      try {
        const path = `/src/data/${language}/clue/${cat}/${difficulty}.json`;
        const moduleLoader = modules[path];

        if (!moduleLoader) {
          console.warn(`ClueGameEngine: Module not found for path: ${path}`);
          return [];
        }

        const module = (await moduleLoader()) as LevelModule;
        const levels = module.default?.levels || module.levels || [];

        return levels.map((lvl: unknown): Level | null => {
          if (typeof lvl === 'object' && lvl !== null) {
            const levelObj = lvl as Record<string, unknown>;
            return {
              id: String(levelObj.id ?? `${difficulty}-${Math.random().toString(36).slice(2, 8)}`),
              clue: String(levelObj.clue ?? ''),
              solution: String(levelObj.solution ?? ''),
              difficulty,
            };
          }
          return null;
        }).filter((l): l is Level => l !== null);
      } catch (err) {
        console.error(`ClueGameEngine: Failed to load levels for ${language}/${cat}/${difficulty}.`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const allLevels = results.flat();

    if (allLevels.length === 0) {
      return [{
        id: 'error-level',
        difficulty: 'easy',
        clue: 'Could not load levels for the selected categories.',
        solution: 'ERROR'
      }];
    }
    
    return shuffleArray(allLevels);
  }

  /**
   * Generates letter options for a given solution word
   */
  public generateLetters(solution: string, difficulty: Difficulty, language: Language): string[] {
    return generateLetters(solution, difficulty, language, false);
  }
}

export const clueGameEngine = new ClueGameEngine();
