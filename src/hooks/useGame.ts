// src/hooks/useGame.ts
import { useState, useEffect, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import type { IGameEngine } from '@/games/engine/types';
import { reducer, type State, type Action } from '@/lib/gameReducer';
import type { Language, GameCategory, Difficulty } from '@/types/game';

/**
 * Defines the options required to initialize the generic game hook.
 */
interface GameHookOptions {
  language: Language;
  categories: GameCategory[];
  difficulty?: Difficulty;
}

/**
 * A generic, reusable hook to manage the core state and logic for any game.
 * It takes a specific game engine and initialization options, and handles
 * level loading, state management, and common actions.
 *
 * @template TLevel The specific type of level data for the game (e.g., Level, ImageLevel).
 * @param engine The game engine instance that conforms to the IGameEngine interface.
 * @param options The settings for the game, such as language and categories.
 * @returns An object containing all the state and handlers needed to run a game.
 */
export function useGame<TLevel extends { solution: string }>(
  engine: IGameEngine<TLevel>,
  options: GameHookOptions
) {
  const navigate = useNavigate();
  const { language, categories, difficulty } = options;

  // --- Core State Management ---
  const [levels, setLevels] = useState<TLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

  // --- Game-Specific State (managed by reducer) ---
  const [gameState, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [],
    answerSlots: [],
    hintIndices: [],
    gameState: "playing",
  });

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  // --- Core Logic Effects ---
  useEffect(() => {
    setLoading(true);
    engine.loadLevels({ language, categories, difficulty })
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories, difficulty, engine]);

  // --- Common Callbacks ---
  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
    } else {
      // If there are no more levels, navigate back to the game selection.
      navigate('/games'); // Or '/kids-games' - could be improved later.
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const resetLevel = useCallback(() => {
    if (!currentLevel) return;
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
  }, [currentLevel, solution.length]);

  // Reset the game board whenever the level changes.
  useEffect(() => {
    if (levels.length > 0) {
      resetLevel();
    }
  }, [currentLevelIndex, levels, resetLevel]);

  return {
    // State
    loading,
    levels,
    currentLevel,
    currentLevelIndex,
    solution,
    notification,
    setNotification,
    
    // Reducer State & Dispatch
    gameState,
    dispatch,

    // Callbacks
    nextLevel,
    resetLevel,
  };
}
