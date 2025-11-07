// src/features/phrase-clue-game/hooks/usePhraseClueGame.ts
/**
 * @description Final "assembler" hook for the Phrase Clue Game.
 * It assembles the final hook by calling the central `useGameController`
 * and passing its result to the specialized `useClueGame` hook with custom scoring.
 * --- It no longer calls useGameMode directly. ---
 */
import { useGameController } from '@/hooks/game/useGameController';
import { useClueGame } from '@/hooks/game/useClueGame';
import { phraseClueGameEngine, type PhraseLevel } from '../engine';

export function usePhraseClueGame() {
  // 1. Get the base controller functionality.
  const controller = useGameController<PhraseLevel>({
    engine: phraseClueGameEngine,
  });

  // 2. Enhance the controller with clue-game logic and specific scoring.
  const puzzle = useClueGame(controller, {
    getPoints: (level) => {
      switch (level.difficulty) {
        case 'hard': return 30;
        case 'medium': return 20;
        default: return 10;
      }
    },
  });

  // 3. Return the fully assembled object.
  return puzzle;
}
