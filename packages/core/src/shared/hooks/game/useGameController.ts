"use client";

// src/hooks/game/useGameController.ts
/**
 * @description The new, central, foundational hook for all level-based games.
 * It acts as a controller, handling all universal game logic and data fetching,
 * including levels, navigation, global settings, assets, and UI content.
 */
import { useGame } from '@core/shared/hooks/useGame';
import { useGameMode } from '@core/shared/hooks/useGameMode';
import { useGameNavigation } from '@core/shared/hooks/game/useGameNavigation';
import { useGameContent } from '@core/shared/hooks/game/useGameContent';
import type { IGameEngine } from '@core/features/games/engine/types';
import type { GameLevel, Difficulty } from '@powerletter/core';
import { useRef, useCallback } from 'react';
import { type InstructionKey } from '@core/shared/hooks/useInstructions';

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
  //    handleBackWith(navigate, gameType) is the deferred version for use in UI layer.
  const { handleBackWith } = useGameNavigation();

  // 3. Get all UI text and instruction content.
  const content = useGameContent(options.gameId);

  // 4. Get universal asset and audio handling.
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const getAssetPath = (path: string) => {
    if (!path) return '';
    // Use indexing to avoid compiler errors in different environments (Vite vs Webpack)
    const metaEnv = (import.meta as any).env;
    const baseUrl = (metaEnv?.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || '/')
      .replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '');
    // URL encode the path to handle Arabic/non-ASCII filenames correctly on Tauri
    // We split by '/' to encode each segment, preserving the slashes
    const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
    return `${baseUrl}/${encodedPath}`;
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
  //    NOTE: handleBack requires a `navigate` function from the UI layer.
  //    Use handleBackWith(navigate, gameType) in your screen components.
  return {
    ...game,
    ...content,
    handleBack: () => console.warn('useGameController: call handleBackWith(navigate, gameType) instead.'),
    handleBackWith,
    gameModeState,
    audioRef,
    getAssetPath,
    playSound,
  };
}
