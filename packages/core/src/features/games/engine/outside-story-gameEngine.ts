// src/features/outside-story-game/engine.ts
/**
 * @description Game engine for the "Outside the Story" game.
 * --- Refactored to use Domain Services from FSD architecture ---
 */
import type { Language, GameCategory } from "@powerletter/core";
// Re-export types from model for backward compatibility
export type { OutsiderLevel as OutsideStoryLevel } from "@core/entities/model/OutsideStory";
import {
  type OutsiderLevel,
  OUTSIDE_STORY_ERROR_LEVEL as ERROR_LEVEL,
} from "@core/entities/model/OutsideStory";

import { BaseGameEngine } from "./BaseGameEngine";
import type { LevelModule } from "./BaseGameEngine";

// Import FSD entities
import { outsideStoryRepository as levelRepository } from "@core/entities/repository/OutsideStoryRepository";

/**
 * Implements the game engine for the Outside the Story game.
 * --- Now extends BaseGameEngine and uses domain services. ---
 */
class OutsideStoryGameEngine extends BaseGameEngine<OutsiderLevel> {
  protected getGameId(): string {
    return "outside-the-story";
  }

  protected async loadModule(
    language: Language,
    category: GameCategory
  ): Promise<LevelModule> {
    // Load one level object per category via repository.
    const [level] = await levelRepository.loadLevels(language, [category]);
    return { levels: level ? [level] : [] };
  }

  protected validateLevel(levelData: unknown): OutsiderLevel | null {
    // Validation is handled mostly by repository shape; keep a strict guard here.
    const level = levelData as OutsiderLevel;

    if (
      !level ||
      !Array.isArray(level.words) ||
      level.words.length === 0 ||
      typeof level.id !== "string"
    ) {
      return null;
    }

    // Pick random solution from selected category words (matches old behavior expectation).
    const randomIndex = Math.floor(Math.random() * level.words.length);
    level.solution = level.words[randomIndex];

    return level;
  }

  protected getErrorLevel(): OutsiderLevel {
    return ERROR_LEVEL;
  }
}

// Export a singleton instance
export const outsideStoryGameEngine = new OutsideStoryGameEngine();
export default outsideStoryGameEngine;
