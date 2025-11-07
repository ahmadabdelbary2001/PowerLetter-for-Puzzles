// src/hooks/game/useChoiceGame.ts
/**
 * @description A specialized "mixin" hook for "choice-style" games.
 * It takes the output from `useGameController` and enhances it with the logic
 * specific to choice games, such as shuffling options and handling clicks.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { shuffleArray } from '@/lib/gameUtils';
import type { GameLevel, Difficulty } from '@/types/game'; // Import Difficulty
import type { useGameController } from './useGameController';

interface ChoiceLevel extends GameLevel {
  solution: string;
  options: string[];
}

// --- The generic constraint for T now matches the one in useGameController. ---
type GameController<T extends GameLevel & { solution: string; difficulty?: Difficulty }> = ReturnType<typeof useGameController<T>>;

// --- The constraint here is also updated for consistency. ---
export function useChoiceGame<T extends ChoiceLevel>(controller: GameController<T>) {
  const { currentLevel } = controller;

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const resetTimerRef = useRef<number | null>(null);

  const handleOptionClick = useCallback((option: string) => {
    if (!currentLevel || answerStatus === 'correct') return;
    setSelectedOption(option);
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
      resetTimerRef.current = window.setTimeout(() => setAnswerStatus('idle'), 1200);
    }
  }, [answerStatus, currentLevel]);

  useEffect(() => {
    if (currentLevel) {
      // --- Use a type assertion to tell TypeScript that currentLevel has an 'options' property. ---
      setShuffledOptions(shuffleArray([...(currentLevel as T).options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, [currentLevel]);

  return {
    ...controller,
    shuffledOptions,
    selectedOption,
    answerStatus,
    handleOptionClick,
  };
}
