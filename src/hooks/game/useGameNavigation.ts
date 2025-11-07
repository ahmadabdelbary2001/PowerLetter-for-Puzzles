// src/hooks/game/useGameNavigation.ts
/**
 * @description A reusable hook that provides a standardized `handleBack` function
 * for navigating away from a game screen. It encapsulates the logic for determining
 * the correct back path based on the current game mode.
 */
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';

export function useGameNavigation() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { gameMode } = useGameMode();

  /**
   * @function handleBack
   * @description Navigates the user back from the current game screen.
   * - In 'competitive' mode, it returns to the team configuration screen.
   * - In 'single' player mode (or for kids' games), it returns to the main game selection menu.
   */
  const handleBack = useCallback(() => {
    const backPath = gameMode === 'competitive'
      ? `/team-config/${params.gameType}`
      : '/games'; // All non-competitive modes go back to the main games list.
    navigate(backPath);
  }, [navigate, gameMode, params.gameType]);

  return { handleBack };
}
