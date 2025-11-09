// src/hooks/game/useChoiceGame.ts
/**
 * @description A specialized "mixin" hook for "choice-style" games.
 * It takes the output from `useGameController` and enhances it with the logic
 * specific to choice games, such as shuffling options and handling clicks.
 * It now uses a useEffect to trigger notifications based on answerStatus.
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
  const { currentLevel, setNotification, tNotification } = controller;

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  const resetTimerRef = useRef<number | null>(null);

  // --- Use a useEffect to react to changes in answerStatus ---
  // This separates the logic for setting state from the side effect of showing a notification.
  useEffect(() => {
    if (answerStatus === 'correct') {
      // --- Set the `messageKey`, not the final message ---
      setNotification({ messageKey: 'correct', type: 'success' });
    } else if (answerStatus === 'incorrect') {
      // --- Set the `messageKey`, not the final message ---
      setNotification({ messageKey: 'tryAgain', type: 'error' });
      resetTimerRef.current = window.setTimeout(() => setAnswerStatus('idle'), 1200);
    }

    // Cleanup timer on component unmount or if status changes again.
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [answerStatus, setNotification, tNotification]);

  // The click handler is now simpler: it only sets the internal state.
  const handleOptionClick = useCallback((option: string) => {
    if (!currentLevel || answerStatus === 'correct') return;

    setSelectedOption(option);
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
  }, [answerStatus, currentLevel]);

  // Effect to reset the game state when the level changes.
  useEffect(() => {
    if (currentLevel) {
      setShuffledOptions(shuffleArray([...(currentLevel as T).options]));
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  // Return the combined controller properties along with the choice-game specific state and handlers.
  return {
    ...controller,
    shuffledOptions,
    selectedOption,
    answerStatus,
    handleOptionClick,
  };
}
