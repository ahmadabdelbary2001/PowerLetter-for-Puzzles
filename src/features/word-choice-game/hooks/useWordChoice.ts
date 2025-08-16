// src/features/word-choice-game/hooks/useWordChoice.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame'; // Import the generic hook
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';
import { shuffleArray } from '@/lib/gameUtils';

export function useWordChoiceGame() {
  const navigate = useNavigate();
  const { language, categories } = useGameMode();

  // --- Generic Game State ---
  const { loading, currentLevel, nextLevel } = useGame<WordChoiceLevel>(
    wordChoiceGameEngine,
    { language, categories }
  );

  // --- Word-Choice Specific State ---
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Word-Choice Specific Callbacks ---
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
  }, []);

  const handleOptionClick = useCallback((option: string) => {
    if (answerStatus !== 'idle' || !currentLevel) return;
    setSelectedOption(option);
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
      setTimeout(nextLevel, 1200);
    } else {
      setAnswerStatus('incorrect');
    }
  }, [answerStatus, currentLevel, nextLevel]);

  const handleBack = useCallback(() => navigate('/kids-games'), [navigate]);

  // --- Effects ---
  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...currentLevel.options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
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
