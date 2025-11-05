// src/features/word-puzzle/hooks/useWordPuzzleGame.ts
/**
 * @description A shared hook for managing the state of any word-based puzzle game.
 * It encapsulates the generic logic for handling user input, game state, and notifications,
 * which can be extended by specific game hooks (like useClueGame).
 */
import { useCallback } from 'react';
import { useGame } from '@/hooks/useGame';
import type { IGameEngine } from '@/games/engine/types';
import type { Language, Difficulty, GameCategory, GameLevel } from '@/types/game';

/**
 * @interface WordPuzzleGameOptions
 * @description Defines the options required to initialize the word puzzle game hook.
 */
interface WordPuzzleGameOptions<T extends GameLevel> {
  engine: IGameEngine<T>;
  language: Language;
  categories: GameCategory[];
  difficulty?: Difficulty;
}

export function useWordPuzzleGame<T extends GameLevel & { solution: string; difficulty?: Difficulty }>({
  engine,
  language,
  categories,
  difficulty,
}: WordPuzzleGameOptions<T>) {
  // --- Destructure all properties from useGame directly. ---
  // This allows us to pass stable functions like `dispatch` and `setNotification`
  // into the dependency arrays of our callbacks, satisfying the ESLint rule.
  const {
    loading,
    levels,
    currentLevel,
    currentLevelIndex,
    solution,
    notification,
    setNotification,
    gameState,
    dispatch,
    nextLevel,
    prevLevel,
    resetLevel,
  } = useGame<T>(engine, { language, categories, difficulty });

  /**
   * @function setNotificationWithTimeout
   * @description A wrapper for setNotification that automatically clears the message.
   */
  const setNotificationWithTimeout = useCallback((
    newNotification: { message: string; type: 'success' | 'error' } | null
  ) => {
    setNotification(newNotification);
    if (newNotification) {
      setTimeout(() => {
        setNotification(null);
      }, 2500);
    }
    // --- Add `setNotification` to the dependency array. ---
  }, [setNotification]);

  /**
   * @function onLetterClick
   * @description Dispatches an action to place a letter in the answer slots.
   */
  const onLetterClick = useCallback((index: number) => {
    if (gameState.gameState === 'playing') {
      // The 'letters' property is now correctly available on gameState.
      dispatch({ type: 'PLACE', gridIndex: index, letter: gameState.letters[index] });
    }
    // --- Add `gameState` and `dispatch` to the dependency array. ---
  }, [gameState, dispatch]);

  /**
   * @function onRemove
   * @description Dispatches an action to remove the last placed letter.
   */
  const onRemove = useCallback(() => {
    dispatch({ type: 'REMOVE_LAST' });
    // --- Add `dispatch` to the dependency array. ---
  }, [dispatch]);

  /**
   * @function onClear
   * @description Dispatches an action to clear all non-hint letters from the board.
   */
  const onClear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
    // --- Add `dispatch` to the dependency array. ---
  }, [dispatch]);

  // Return all the state and functions needed by the specific game hooks.
  return {
    loading,
    levels,
    currentLevel,
    currentLevelIndex,
    solution,
    notification,
    // Expose the new auto-clearing notification setter
    setNotification: setNotificationWithTimeout,
    gameState,
    dispatch,
    nextLevel,
    prevLevel,
    resetLevel,
    // Expose letters for convenience
    letters: gameState.letters,
    onLetterClick,
    onRemove,
    onClear,
  };
}
