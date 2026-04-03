// src/hooks/game/useGameController.ts
/**
 * @description The new, central, foundational hook for all level-based games.
 * It acts as a controller, handling all universal game logic and data fetching,
 * including levels, navigation, global settings, assets, and UI content.
 */
import { useGame } from '@/hooks/useGame';
import { useGameMode } from '@/hooks/useGameMode';
import { useGameNavigation } from '@/hooks/game/useGameNavigation';
import { useGameContent } from '@/hooks/game/useGameContent';
import type { IGameEngine } from '@/games/engine/types';
import type { GameLevel, Difficulty } from '@/types/game';
import { useRef, useCallback } from 'react';
import { type InstructionKey } from '@/hooks/useInstructions';

interface GameControllerOptions<T extends GameLevel> {
  engine: IGameEngine<T>;
  gameId: InstructionKey;
}

export function useGameController<T extends GameLevel & { solution: string; difficulty?: Difficulty }> (
  options: GameControllerOptions<T>
) {
  const gameModeState = useGameMode();
  const { language, categories, difficulty } = gameModeState;

  // 1. Get core level-loading and reducer logic.
  const game = useGame<T>(options.engine, {
    language,
    categories,
    difficulty,
  });

  // 2. Get standardized back navigation.
  const { handleBack } = useGameNavigation();

  // 3. Get all UI text and instruction content.
  const content = useGameContent(options.gameId);

  // 4. Get universal asset and audio handling.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const getAssetPath = (path: string) => {
    if (!path) return '';
    const baseUrl = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };
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

  
  // 5. Return a single, unified object with all core functionalities.
  return {
    ...game,
    ...content,
    handleBack,
    gameModeState,
    audioRef,
    getAssetPath,
    playSound,
  };
}
