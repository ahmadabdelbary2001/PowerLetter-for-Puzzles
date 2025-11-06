// src/features/word-choice-game/hooks/useWordChoiceGame.ts
/**
 * @description Custom hook for the Word Choice Game.
 * This hook is now a simple wrapper around the shared `useChoiceGame` hook,
 * configured with the specific engine for this game.
 */
import { useChoiceGame } from '@/hooks/game/useChoiceGame';
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';

export function useWordChoiceGame() {
  // All game logic is now handled by the reusable useChoiceGame hook.
  // We just need to provide the correct engine for this specific game.
  return useChoiceGame<WordChoiceLevel>(wordChoiceGameEngine);
}
