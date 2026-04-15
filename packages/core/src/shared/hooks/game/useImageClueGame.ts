// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Final "assembler" hook for the Image Clue Game.
 */
import { useGameController } from '@core/shared/hooks/game/useGameController';
import { useClueGame } from '@core/shared/hooks/game/useClueGame';
import { imgClueGameEngine } from '@core/features/games/engine/img-clue-gameEngine';
import type { ImageLevel } from '@core/entities/model/ImgClue';

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
