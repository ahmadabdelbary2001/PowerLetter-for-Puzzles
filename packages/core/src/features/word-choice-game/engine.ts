// src/features/word-choice-game/engine.ts
/**
 * @description The game engine for the Word Choice game.
 * It extends the shared ChoiceGameEngine to inherit all common level-loading logic,
 * and only needs to provide its unique game ID.
 */
import { ChoiceGameEngine, type ChoiceLevel } from '../../games/engine/ChoiceGameEngine';
import type { Language, GameCategory } from '@powerletter/core';
import type { LevelModule } from '../../games/engine/BaseGameEngine';

/**
 * @interface WordChoiceLevel
 * @description Defines the specific structure of a level for the Word Choice game.
 * It extends the base ChoiceLevel with 'image' and 'sound' properties for the visual/audio prompt.
 */
export interface WordChoiceLevel extends ChoiceLevel {
  image: string;
  sound: string;
}

// The engine class simply extends the base and provides the game ID.
class WordChoiceGameEngine extends ChoiceGameEngine<WordChoiceLevel> {
  protected getGameId(): 'word-choice' {
    return 'word-choice';
  }

  protected loadModule(language: Language, category: GameCategory): Promise<LevelModule> {
    return import(`../../data/${language}/word-choice/${category}/data.json`);
  }
}

// Export a single instance of the engine.
export const wordChoiceGameEngine = new WordChoiceGameEngine();
