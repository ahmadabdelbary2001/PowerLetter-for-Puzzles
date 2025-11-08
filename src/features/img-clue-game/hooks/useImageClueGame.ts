// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Final "assembler" hook for the Image Clue Game.
 */
import { useGameController } from '@/hooks/game/useGameController';
import { useClueGame } from '@/hooks/game/useClueGame';
import { imgClueGameEngine, type ImageLevel } from '../engine';

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
