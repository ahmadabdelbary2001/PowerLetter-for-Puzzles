// src/features/img-choice-game/hooks/useImgChoiceGame.ts
/**
 * @description Final "assembler" hook for the Image Choice Game.
 * --- It no longer calls useGameMode directly. ---
 */

import { useGameController } from '@/hooks/game/useGameController';
import { useChoiceGame } from '@/hooks/game/useChoiceGame';
import { imgChoiceGameEngine, type ImgChoiceLevel } from '@/features/img-choice-game/engine';

export function useImgChoiceGame() {
  // 1. Get the base controller.
  const controller = useGameController<ImgChoiceLevel>({
    engine: imgChoiceGameEngine,
  });

  // 2. Enhance with choice-game logic and return.
  return useChoiceGame(controller);
}
