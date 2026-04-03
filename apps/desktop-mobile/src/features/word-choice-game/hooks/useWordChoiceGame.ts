// src/features/word-choice-game/hooks/useWordChoiceGame.ts
import { useGameController } from '@/hooks/game/useGameController';
import { useChoiceGame } from '@/hooks/game/useChoiceGame';
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';

export function useWordChoiceGame() {
  // 1. Get the fully-equipped controller.
  const controller = useGameController<WordChoiceLevel>({
    engine: wordChoiceGameEngine,
    gameId: 'wordChoice',
  });

  // 2. Enhance with choice-game logic and return the final object for the UI.
  return useChoiceGame(controller);
}
