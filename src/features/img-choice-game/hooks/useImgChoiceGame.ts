// src/features/img-choice-game/hooks/useImgChoiceGame.ts
/**
 * @description Custom hook for the Image Choice Game.
 * This hook is now a simple wrapper around the shared `useChoiceGame` hook,
 * configured with the specific engine for this game.
 */
import { useChoiceGame } from '@/hooks/game/useChoiceGame';
import { imgChoiceGameEngine, type ImgChoiceLevel } from '@/features/img-choice-game/engine';

export function useImgChoiceGame() {
  // All game logic is now handled by the reusable useChoiceGame hook.
  // We just need to provide the correct engine for this specific game.
  return useChoiceGame<ImgChoiceLevel>(imgChoiceGameEngine);
}
