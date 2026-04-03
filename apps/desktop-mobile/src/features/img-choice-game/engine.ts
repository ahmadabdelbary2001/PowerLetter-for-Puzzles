// src/features/img-choice-game/engine.ts
/**
 * @description The game engine for the Image Choice game.
 * It extends the shared ChoiceGameEngine to inherit all common level-loading logic,
 * and only needs to provide its unique game ID.
 */
import { ChoiceGameEngine, type ChoiceLevel } from '@/games/engine/ChoiceGameEngine';

/**
 * @interface ImgChoiceLevel
 * @description Defines the specific structure of a level for the Image Choice game.
 * It extends the base ChoiceLevel with a 'word' property for the text prompt.
 */
export interface ImgChoiceLevel extends ChoiceLevel {
  word: string;
  sound?: string;
}

// The engine class simply extends the base and provides the game ID.
class ImageChoiceGameEngine extends ChoiceGameEngine<ImgChoiceLevel> {
  protected getGameId(): 'img-choice' {
    return 'img-choice';
  }
}

// Export a single instance of the engine.
export const imgChoiceGameEngine = new ImageChoiceGameEngine();
