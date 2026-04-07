// src/hooks/game/useGameNavigation.ts
/**
 * @description A reusable hook that provides a standardized `handleBack` function.
 *
 * Two usage patterns:
 *  1. Pass { navigate, gameType } directly (framework-agnostic).
 *  2. Call with no args to get a `handleBack(navigate, gameType)` deferred form
 *     — used by useGameController so core stays router-independent.
 */
import { useCallback } from 'react';
import { useGameMode } from '../../hooks/useGameMode';

interface UseGameNavigationOptions {
  navigate?: (path: string) => void;
  gameType?: string;
}

export function useGameNavigation(options?: UseGameNavigationOptions) {
  const { gameMode } = useGameMode();

  /**
   * Immediate handleBack — only works when navigate + gameType are provided.
   */
  const handleBack = useCallback(() => {
    if (!options?.navigate) {
      console.warn('useGameNavigation: no navigate function provided');
      return;
    }
    const backPath = gameMode === 'competitive'
      ? `/team-config/${options.gameType}`
      : '/games';
    options.navigate(backPath);
  }, [options?.navigate, options?.gameType, gameMode]);

  /**
   * Deferred handleBack — accepts navigate + gameType at call time.
   * Used by useGameController which can't import from the router layer.
   */
  const handleBackWith = useCallback((navigate: (path: string) => void, gameType?: string) => {
    const backPath = gameMode === 'competitive'
      ? `/team-config/${gameType}`
      : '/games';
    navigate(backPath);
  }, [gameMode]);

  return { handleBack, handleBackWith };
}
