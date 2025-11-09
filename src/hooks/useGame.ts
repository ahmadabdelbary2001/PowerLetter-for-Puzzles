// src/hooks/useGame.ts
/**
 * @description A generic hook for managing the core lifecycle of any level-based game.
 * It handles loading levels, managing the current level index, and providing navigation.
 */
import { useState, useEffect, useCallback, useReducer } from 'react';
import { gameReducer } from '@/lib/gameReducer';
import type { IGameEngine } from '@/games/engine/types';
import type { Language, Difficulty, GameCategory } from '@/types/game';
import type { NotificationData } from '@/components/atoms/Notification';

export function useGame<T extends { solution: string; difficulty?: Difficulty }>(
  engine: IGameEngine<T>,
  options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }
) {
  const [levels, setLevels] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution ?? '';

  const [gameState, dispatch] = useReducer(gameReducer, {
    gameState: 'playing',
    answerSlots: Array(solution.length).fill(''),
    slotIndices: Array(solution.length).fill(null),
    hintIndices: [],
    letters: [],
  });

  // Destructure options to get stable variables for dependencies.
  const { language, categories, difficulty } = options;

  const load = useCallback(async () => {
    setLoading(true);
    // Use the destructured variables here.
    const loadedLevels = await engine.loadLevels({ language, categories, difficulty });
    setLevels(loadedLevels);
    setLoading(false);
    if (loadedLevels.length > 0) {
      const firstLevel = loadedLevels[0];
      const newLetters = engine.generateLetters ? engine.generateLetters(firstLevel.solution, firstLevel.difficulty ?? 'easy', language) : [];
      dispatch({ type: 'RESET', solution: firstLevel.solution, letters: newLetters });
    }
    // --- Replaced 'categoriesKey' with 'categories' ---
    // This satisfies the exhaustive-deps rule and makes the dependency explicit.
    // The behavior remains correct because we want `load` to be recreated when `categories` changes.
  }, [engine, language, categories, difficulty]);

  useEffect(() => {
    load();
  }, [load]); // This effect is now safe and will not cause an infinite loop.

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    }
  }, [currentLevelIndex, levels.length]);

  const prevLevel = useCallback(() => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(currentLevelIndex - 1);
    }
  }, [currentLevelIndex]);

  const resetLevel = useCallback(() => {
    if (currentLevel) {
      const newLetters = engine.generateLetters ? engine.generateLetters(currentLevel.solution, currentLevel.difficulty ?? 'easy', language) : [];
      dispatch({ type: 'RESET', solution: currentLevel.solution, letters: newLetters });
    }
  }, [currentLevel, engine, language, dispatch]);

  useEffect(() => {
    if (levels.length > 0) {
      resetLevel();
    }
  }, [currentLevelIndex, levels, resetLevel]);

  // --- Create the clear function ---
  const onClearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return {
    loading,
    levels,
    currentLevel,
    currentLevelIndex,
    solution,
    notification,
    setNotification,
    onClearNotification,
    gameState,
    dispatch,
    nextLevel,
    prevLevel,
    resetLevel,
  };
}
