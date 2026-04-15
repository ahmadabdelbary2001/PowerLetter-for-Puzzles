// src/features/phrase-clue-game/hooks/usePhraseClueGame.ts
import { useGameController } from '@core/shared/hooks/game/useGameController';
import { useClueGame } from '@core/shared/hooks/game/useClueGame';
import { phraseClueGameEngine } from '@core/features/games/engine/phrase-clue-gameEngine';
import type { PhraseLevel } from '@core/entities/model/PhraseClue';

export function usePhraseClueGame() {
  // 1. Get the fully-equipped controller.
  const controller = useGameController<PhraseLevel>({
    engine: phraseClueGameEngine,
    gameId: 'phraseClue',
  });

  // 2. Enhance with clue-game logic and return the final object for the UI.
  return useClueGame(controller, {
    getPoints: (level: PhraseLevel) => {
      switch (level.difficulty) {
        case 'hard': return 30;
        case 'medium': return 20;
        default: return 10;
      }
    },
  });
}
