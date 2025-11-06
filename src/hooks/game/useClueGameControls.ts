// src/hooks/game/useClueGameControls.ts
/**
 * useClueGameControls hook - Manages the enabled/disabled state of game control buttons
 * Determines whether actions like remove, clear, check, and hint should be available based on game state
 * Handles both single-player and competitive game modes with different rules for hint usage
 */
import { useMemo } from 'react';
import type { State } from '@/lib/gameReducer';
import { useGameMode } from '@/hooks/useGameMode';

/**
 * Custom hook for managing game control states
 * Calculates whether each game control action should be enabled based on current game state
 * @param state - Current game state from the game reducer
 * @returns Object containing boolean flags for each control action
 */
export function useClueGameControls(state: State) {
  // Extract relevant state properties
  const { gameState, slotIndices, answerSlots, hintIndices } = state;
  // Get game mode and team information
  const { gameMode, teams, currentTeam } = useGameMode();

  // Determine if the remove action should be enabled
  const canRemove = useMemo(() => {
    // Only allow removal during active gameplay
    if (gameState !== 'playing') return false;
    // Can remove if there are letters placed that aren't hints
    return slotIndices.some(i => i !== null && !hintIndices.includes(i as number));
  }, [gameState, slotIndices, hintIndices]);

  // Determine if the clear action should be enabled
  const canClear = useMemo(() => {
    // Only allow clearing during active gameplay
    if (gameState !== 'playing') return false;
    // Can clear if there are letters placed beyond just the hints
    return slotIndices.filter(i => i !== null).length > hintIndices.length;
  }, [gameState, slotIndices, hintIndices]);

  // Determine if the check action should be enabled
  const canCheck = useMemo(() => {
    // Only allow checking during active gameplay
    if (gameState !== 'playing') return false;
    // Can check if all answer slots are filled
    return answerSlots.every(ch => ch !== '');
  }, [gameState, answerSlots]);

  // Determine if the hint action should be enabled
  const canHint = useMemo(() => {
    // Only allow hints during active gameplay
    if (gameState !== 'playing') return false;
    // In competitive mode, check if the current team has hints remaining
    if (gameMode === 'competitive') {
      return (teams[currentTeam]?.hintsRemaining ?? 0) > 0;
    }
    // In single-player mode, hints are always available
    return true;
  }, [gameState, gameMode, teams, currentTeam]);

  // Return all control state flags
  return { canRemove, canClear, canCheck, canHint };
}
