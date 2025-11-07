// src/hooks/game/useGameController.ts
/**
 * @description The new, central, foundational hook for all level-based games.
 * It now also provides universal asset and audio handling.
 */
import { useGame } from '@/hooks/useGame';
import { useGameMode } from '@/hooks/useGameMode';
import { useGameNavigation } from '@/hooks/game/useGameNavigation';
import type { IGameEngine } from '@/games/engine/types';
import type { GameLevel, Difficulty } from '@/types/game';
import { useRef, useCallback } from 'react';

interface GameControllerOptions<T extends GameLevel> {
  engine: IGameEngine<T>;
}

export function useGameController<T extends GameLevel & { solution: string; difficulty?: Difficulty }> (
  options: GameControllerOptions<T>
) {
  const { language, categories, difficulty, gameMode } = useGameMode();

  const game = useGame<T>(options.engine, {
    language,
    categories,
    difficulty,
  });

  const { handleBack } = useGameNavigation();

  // --- Centralized asset and audio handling logic. ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * @function getAssetPath
   * @description Constructs the full, correct path for any game asset.
   */
  const getAssetPath = (path: string) => {
    if (!path) return '';
    // Use import.meta.env.BASE_URL to handle deployment subdirectories correctly.
    const baseUrl = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  /**
   * @function playSound
   * @description Plays the audio element referenced by audioRef.
   */
  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play().catch((e) => console.error('Audio play failed:', e));
    } catch (e) {
      console.error('Audio control failed:', e);
    }
  }, []);


  // Return a single, unified object with all core functionalities.
  return {
    ...game,
    handleBack,
    gameMode,
    // --- Provide the asset handling tools to all downstream hooks. ---
    audioRef,
    getAssetPath,
    playSound,
  };
}
