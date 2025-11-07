// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Final "assembler" hook for the Image Clue Game.
 * It assembles the final hook by calling the central `useGameController`
 * and passing its result to the specialized `useClueGame` hook.
 * --- It no longer contains any logic of its own. ---
 */
// --- useRef and useCallback are no longer needed here. ---
import { useGameController } from '@/hooks/game/useGameController';
import { useClueGame } from '@/hooks/game/useClueGame';
import { imgClueGameEngine, type ImageLevel } from '../engine';

export function useImageClueGame() {
  // 1. Get the base controller functionality.
  const controller = useGameController<ImageLevel>({
    engine: imgClueGameEngine,
  });

  // 2. Enhance the controller with clue-game-specific logic and return.
  //    The controller already provides getAssetPath, playSound, and audioRef,
  //    and useClueGame will pass them through automatically.
  return useClueGame(controller);
}
