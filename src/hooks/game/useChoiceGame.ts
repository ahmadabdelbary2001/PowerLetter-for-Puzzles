// src/hooks/game/useChoiceGame.ts
/**
 * @description A shared, reusable hook for managing the state and logic of any "choice-based" game.
 * It handles game initialization, shuffling options, player selections, answer validation, and game flow.
 * It is configured by passing a specific game engine.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame';
import { shuffleArray } from '@/lib/gameUtils';
import type { IGameEngine, GameLevel } from '@/types/game';

/**
 * @interface ChoiceLevel
 * @description Defines the expected structure for a level in a choice-based game.
 * It must have a solution and a list of options.
 */
interface ChoiceLevel extends GameLevel {
  solution: string;
  options: string[];
}

/**
 * @function useChoiceGame
 * @description The core reusable hook for choice-based games.
 * @param {IGameEngine<T>} engine - The specific game engine to use for loading levels.
 * @returns All the state and functions needed by a choice game component.
 */
export function useChoiceGame<T extends ChoiceLevel>(engine: IGameEngine<T>) {
  // --- Shared Hooks and State ---
  const navigate = useNavigate();
  const { language, categories, gameMode, gameType } = useGameMode();

  // Use the generic useGame hook, configured with the provided engine
  const { loading, currentLevel, nextLevel } = useGame<T>(engine, {
    language,
    categories,
  });

  // State declarations for managing the choice UI
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resetTimerRef = useRef<number | null>(null);

  // --- Shared Callbacks and Helpers ---

  // Asset path and sound playback functions
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
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

  /**
   * @function handleOptionClick
   * @description Handles the user's selection of an option.
   * This logic is now shared between both image and word choice games.
   */
  const handleOptionClick = useCallback(
    (option: string) => {
      if (!currentLevel || answerStatus === 'correct') return;

      setSelectedOption(option);

      if (option === currentLevel.solution) {
        // Set the status to 'correct' and let the user click "Next" to advance.
        setAnswerStatus('correct');
      } else {
        // Handle incorrect answer and reset after a delay.
        setAnswerStatus('incorrect');
        resetTimerRef.current = window.setTimeout(() => setAnswerStatus('idle'), 1200);
      }
    },
    [answerStatus, currentLevel]
  );

  // Navigation back handler, now shared
  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      // All non-competitive games go back to the main game selection screen.
      navigate('/games');
    }
  }, [navigate, gameMode, gameType]);

  // --- Shared Effects ---

  // Effect to set up a new level by shuffling options
  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...currentLevel.options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  // Cleanup effect for timers and audio
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      if (audio) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {
          console.error('Failed to pause/reset audio during cleanup', e);
        }
      }
    };
  }, [currentLevel]); // Rerunning on level change ensures old timers/audio are cleaned up.

  // Return all state and handlers for the UI to use
  return {
    loading,
    currentLevel,
    shuffledOptions,
    answerStatus,
    selectedOption,
    audioRef,
    getAssetPath,
    playSound,
    handleOptionClick,
    nextLevel,
    handleBack,
  };
}
