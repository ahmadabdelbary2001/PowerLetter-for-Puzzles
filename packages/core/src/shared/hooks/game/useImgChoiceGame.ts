// src/features/img-choice-game/hooks/useImgChoiceGame.ts
/**
 * @description Final "assembler" hook for the Image Choice Game.
 */
import { useGameController } from '@core/shared/hooks/game/useGameController';
import { useChoiceGame } from '@core/shared/hooks/game/useChoiceGame';
import { imgChoiceGameEngine, type ImgChoiceLevel } from '@core/features/games/engine/img-choice-gameEngine';

export function useImgChoiceGame() {
  // 1. Get the fully-equipped controller.
  const controller = useGameController<ImgChoiceLevel>({
    engine: imgChoiceGameEngine,
    gameId: 'imgChoice',
  });

  // 2. Enhance with choice-game logic and return the final object for the UI.
  return useChoiceGame(controller);
}
