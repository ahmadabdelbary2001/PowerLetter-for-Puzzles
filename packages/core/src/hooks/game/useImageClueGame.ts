// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Final "assembler" hook for the Image Clue Game.
 */
import { useGameController } from '@core/hooks/game/useGameController';
import { useClueGame } from '@core/hooks/game/useClueGame';
import { imgClueGameEngine, type ImageLevel } from '../../engine/img-clue-gameEngine';

export function useImageClueGame() {
  // 1. Get the fully-equipped controller.
  //    It provides game logic, state, AND all UI content.
  const controller = useGameController<ImageLevel>({
    engine: imgClueGameEngine,
    gameId: 'imgClue',
  });

  // 2. Enhance with clue-game logic and return the final object for the UI.
  return useClueGame(controller);
}
