// src/features/phrase-clue-game/hooks/usePhraseClueGame.ts
/**
 * @description Custom hook for the Phrase Clue Game.
 * This hook is now a thin wrapper around the powerful `useClueGame` hook.
 * Its only job is to provide game-specific configuration, like the engine,
 * the point-scoring logic, and the back navigation handler.
 */
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useClueGame } from '@/hooks/game/useClueGame';
import { phraseClueGameEngine, type PhraseLevel } from '../engine';

export function usePhraseClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty, gameMode } = useGameMode();

  // Define the game-specific point calculation logic.
  const getPoints = useCallback((level: PhraseLevel) => {
    switch (level.difficulty) {
      case 'hard': return 30;
      case 'medium': return 20;
      default: return 10;
    }
  }, []);

  // Use the shared `useClueGame` hook, providing the engine and scoring logic.
  const puzzle = useClueGame<PhraseLevel>({
    engine: phraseClueGameEngine,
    language,
    categories,
    difficulty,
    getPoints, // Pass the specific scoring function.
  });

  // The handleBack logic is one of the few remaining specific pieces.
  const handleBack = useCallback(() => {
    navigate(gameMode === 'competitive' ? `/team-config/${params.gameType}` : `/game-mode/${params.gameType}`);
  }, [navigate, params.gameType, gameMode]);

  // Return everything from the shared hook, plus the specific handleBack.
  return {
    ...puzzle,
    handleBack,
  };
}
