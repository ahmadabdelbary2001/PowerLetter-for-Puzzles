// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Custom hook for the Image Clue Game.
 * This hook is a thin wrapper around the powerful `useClueGame` hook.
 * Its main jobs are to provide the correct engine, handle back navigation,
 * and manage game-specific features like audio playback.
 */
import { useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useClueGame } from '@/hooks/game/useClueGame';
import { imgClueGameEngine, type ImageLevel } from '../engine';

export function useImageClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, gameMode } = useGameMode();

  // Use the shared `useClueGame` hook. Since this game always awards 1 point,
  // we can rely on the default `getPoints` function in the shared hook and not pass one.
  const puzzle = useClueGame<ImageLevel>({
    engine: imgClueGameEngine,
    language,
    categories,
    difficulty: 'easy', // This game is always 'easy'.
  });

  // --- Game-specific state and functions that don't belong in the shared hook ---
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAssetPath = (path: string) => {
    const base = (import.meta).env?.BASE_URL ?? '/';
    const baseUrl = String(base).replace(/\/+$/, '');
    const normalized = path.replace(/^\/+/, '');
    return `${baseUrl}/${normalized}`;
  };
  const playSound = useCallback(() => {
    audioRef.current?.play().catch((e) => console.error('Audio play failed:', e));
  }, []);

  const handleBack = useCallback(() => {
    // Image Clue is a kids' game, so it has a different back path in single-player.
    navigate(gameMode === 'competitive' ? `/team-config/${params.gameType}` : '/games');
  }, [navigate, params.gameType, gameMode]);

  // Return everything from the shared hook, plus the game-specific additions.
  return {
    ...puzzle,
    handleBack,
    audioRef,
    getAssetPath,
    playSound,
  };
}
