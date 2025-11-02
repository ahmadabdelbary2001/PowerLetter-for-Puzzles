// src/features/picture-choice-game/hooks/usePictureChoiceGame.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame';
import { pictureChoiceGameEngine, type PictureChoiceLevel } from '@/features/picture-choice-game/engine';
import { shuffleArray } from '@/lib/gameUtils';

export function usePictureChoiceGame() {
  const navigate = useNavigate();
  const { language, categories, gameMode, gameType } = useGameMode();

  const { loading, currentLevel, nextLevel } = useGame<PictureChoiceLevel>(pictureChoiceGameEngine, {
    language,
    categories,
  });

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nextTimerRef = useRef<number | null>(null);
  const resetTimerRef = useRef<number | null>(null);

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

  const handleOptionClick = useCallback(
    (option: string) => {
      if (!currentLevel) return;
      if (answerStatus === 'correct') return;

      setSelectedOption(option);

      if (option === currentLevel.solution) {
        setAnswerStatus('correct');
        nextTimerRef.current = window.setTimeout(() => {
          nextLevel();
        }, 1200);
      } else {
        setAnswerStatus('incorrect');
        resetTimerRef.current = window.setTimeout(() => setAnswerStatus('idle'), 1200);
      }
    },
    [answerStatus, currentLevel, nextLevel]
  );

  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate('/kids-games');
    }
  }, [navigate, gameMode, gameType]);

  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...currentLevel.options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  // cleanup timers & audio when level changes or unmounts
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (nextTimerRef.current) {
        clearTimeout(nextTimerRef.current);
        nextTimerRef.current = null;
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      if (audio) {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {
          // log the error instead of swallowing it silently
          // this helps debugging in environments where pause/currentTime may throw
          // (e.g. some browsers or mocked audio nodes in tests)
          console.error('Failed to pause/reset audio during cleanup', e);
        }
      }
    };
  }, [currentLevel]);

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
