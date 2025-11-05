// src/features/word-choice-game/hooks/useWordChoice.ts
/**
 * useWordChoiceGame hook - Manages state and logic for the word choice puzzle game for kids
 * Handles game initialization, player actions, and game flow for a kid-friendly multiple choice experience.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame';
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';
import { shuffleArray } from '@/lib/gameUtils';

/**
 * Custom hook for managing the Word Choice Game state and logic.
 * Provides game state, actions, and callbacks for the Word Choice Game component.
 */
export function useWordChoiceGame() {
  // Navigation and game mode settings
  const navigate = useNavigate();
  const { language, categories, gameMode, gameType } = useGameMode();

  // Use the generic game hook for common game functionality
  const { loading, currentLevel, nextLevel } = useGame<WordChoiceLevel>(
    wordChoiceGameEngine,
    { language, categories }
  );

  // Word-Choice Specific State
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Word-Choice Specific Callbacks
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
  }, []);

  /**
   * @function handleOptionClick
   * @description Handles the user's selection of a word option.
   */
  const handleOptionClick = useCallback((option: string) => {
    if (!currentLevel || answerStatus === 'correct') return;

    setSelectedOption(option);

    if (option === currentLevel.solution) {
      // --- Only set the status to 'correct'. ---
      // Do NOT automatically call nextLevel(). The UI will now show the "Next"
      // button, and the user must click it to advance.
      setAnswerStatus('correct');
    } else {
      // Unchanged: Handle incorrect answer
      setAnswerStatus('incorrect');
      setTimeout(() => setAnswerStatus('idle'), 1200);
    }
  }, [answerStatus, currentLevel]);

  // Handle navigation back based on game mode
  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate('/games');
    }
  }, [navigate, gameMode, gameType]);

  // Effect to shuffle options when a new level is loaded
  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...currentLevel.options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  // Return all the state and functions needed by the component
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
