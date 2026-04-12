// src/features/phrase-clue-game/hooks/usePhraseClueGame.ts
import { useGameController } from '@core/hooks/game/useGameController';
import { useClueGame } from '@core/hooks/game/useClueGame';
import { phraseClueGameEngine, type PhraseLevel } from '../../engine/phrase-clue-gameEngine';

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
