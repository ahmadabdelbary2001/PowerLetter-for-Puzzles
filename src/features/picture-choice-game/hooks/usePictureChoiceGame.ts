// src/features/picture-choice-game/hooks/usePictureChoiceGame.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame';
import { pictureChoiceGameEngine, type PictureChoiceLevel } from '@/features/picture-choice-game/engine';
import { shuffleArray } from '@/lib/gameUtils';

export function usePictureChoiceGame() {
  const navigate = useNavigate();
  // Get game mode and other settings
  const { language, categories, gameMode, gameType } = useGameMode();

  // Use the base useGame hook
  const { loading, currentLevel, nextLevel } = useGame<PictureChoiceLevel>(pictureChoiceGameEngine, {
    language,
    categories,
  });

  // State declarations
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // --- The `nextTimerRef` is no longer needed. ---
  const resetTimerRef = useRef<number | null>(null);

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
   * @description Handles the user's selection of an image option.
   */
  const handleOptionClick = useCallback(
    (option: string) => {
      if (!currentLevel) return;
      // Prevent further clicks if the answer is already correct.
      if (answerStatus === 'correct') return;

      setSelectedOption(option);

      if (option === currentLevel.solution) {
        // --- Only set the status to 'correct'. ---
        // Do NOT automatically call nextLevel(). The UI will show the "Next"
        // button, and the user will click it to trigger nextLevel().
        setAnswerStatus('correct');
      } else {
        // Unchanged: Handle incorrect answer
        setAnswerStatus('incorrect');
        resetTimerRef.current = window.setTimeout(() => setAnswerStatus('idle'), 1200);
      }
    },
    // Dependencies for the callback
    [answerStatus, currentLevel]
  );

  // Navigation back handler
  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      // --- Corrected the back navigation for kids games ---
      // It should go back to the game selection screen, not a hardcoded path.
      navigate('/games');
    }
  }, [navigate, gameMode, gameType]);

  // Effect to set up a new level
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
      // --- Cleanup for `nextTimerRef` is no longer needed. ---
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
  }, [currentLevel]);

  // Return all state and handlers
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
