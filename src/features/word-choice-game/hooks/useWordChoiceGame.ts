// src/features/word-choice-game/hooks/useWordChoiceGame.ts
/**
 * @description Final "assembler" hook for the Word Choice Game.
 * --- It no longer calls useGameMode directly. ---
 */

import { useGameController } from '@/hooks/game/useGameController';
import { useChoiceGame } from '@/hooks/game/useChoiceGame';
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';

export function useWordChoiceGame() {
  // 1. Get the base controller.
  const controller = useGameController<WordChoiceLevel>({
    engine: wordChoiceGameEngine,
  });

  // 2. Enhance with choice-game logic and return.
  return useChoiceGame(controller);
}
