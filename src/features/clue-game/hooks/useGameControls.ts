// src/features/clue-game/hooks/useGameControls.ts
import { useMemo } from 'react';
import type { State } from '@/lib/gameReducer';
import { useGameMode } from '@/hooks/useGameMode';

export function useGameControls(state: State) {
  const { gameState, slotIndices, answerSlots, hintIndices } = state;
  const { gameMode, teams, currentTeam } = useGameMode();

  const canRemove = useMemo(() => {
    if (gameState !== 'playing') return false;
    return slotIndices.some(i => i !== null && !hintIndices.includes(i as number));
  }, [gameState, slotIndices, hintIndices]);

  const canClear = useMemo(() => {
    if (gameState !== 'playing') return false;
    return slotIndices.filter(i => i !== null).length > hintIndices.length;
  }, [gameState, slotIndices, hintIndices]);

  const canCheck = useMemo(() => {
    if (gameState !== 'playing') return false;
    return answerSlots.every(ch => ch !== '');
  }, [gameState, answerSlots]);

  const canHint = useMemo(() => {
    if (gameState !== 'playing') return false;
    if (gameMode === 'competitive') {
      return (teams[currentTeam]?.hintsRemaining ?? 0) > 0;
    }
    return true;
  }, [gameState, gameMode, teams, currentTeam]);

  return { canRemove, canClear, canCheck, canHint };
}
