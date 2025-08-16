// src/features/word-choice-game/hooks/useWordChoice.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { shuffleArray } from '@/lib/gameUtils';
// FIX: Import the engine, not a non-existent function
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';

export function useWordChoiceGame() {
  const navigate = useNavigate();
  const { language, categories } = useGameMode();

  const [levels, setLevels] = useState<WordChoiceLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentLevel = levels[currentLevelIndex];

  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const assetPath = path.replace(/^\//, '');
    return `${baseUrl}/${assetPath}`;
  };

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
      setSelectedOption(null);
      setAnswerStatus('idle');
    } else {
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const handleOptionClick = useCallback((option: string) => {
    if (answerStatus !== 'idle') return;
    setSelectedOption(option);
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
      setTimeout(nextLevel, 1200);
    } else {
      setAnswerStatus('incorrect');
    }
  }, [answerStatus, currentLevel, nextLevel]);

  const handleBack = useCallback(() => {
    navigate('/kids-games');
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    // FIX: Use the engine to load levels
    wordChoiceGameEngine.loadLevels({ language, categories })
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...currentLevel.options]));
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
