// src/hooks/game/useClueGame.ts
/**
 * @description A unified, shared hook for managing the state of any "clue-style" puzzle game.
 * It now encapsulates the core game loop, including the complex logic for checking answers
 * in both single-player and competitive modes, while allowing for game-specific configuration.
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useGame } from '@/hooks/useGame';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import type { IGameEngine } from '@/games/engine/types';
import type { Language, Difficulty, GameCategory, GameLevel } from '@/types/game';

// Helper to normalize strings for comparison, making it language-agnostic and robust.
const normalize = (s: string) => s.toLowerCase().trim();

/**
 * @interface ClueGameOptions
 * @description Defines the options required to initialize the clue game hook.
 */
interface ClueGameOptions<T extends GameLevel> {
  engine: IGameEngine<T>;
  language: Language;
  categories: GameCategory[];
  difficulty?: Difficulty;
  getPoints?: (level: T) => number;
}

export function useClueGame<T extends GameLevel & { solution: string }>({
  engine,
  language,
  categories,
  difficulty,
  getPoints = () => 1,
}: ClueGameOptions<T>) {
  // --- Base Hooks ---
  const {
    loading, levels, currentLevel, currentLevelIndex, solution, notification,
    setNotification, gameState, dispatch, nextLevel, prevLevel, resetLevel,
  } = useGame<T>(engine, { language, categories, difficulty });

  const { gameMode, teams, currentTeam, setCurrentTeam, updateScore, nextTurn, consumeHint } = useGameMode();
  const { t } = useTranslation();

  // --- Shared State ---
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());

  // --- Effects ---
  useEffect(() => {
    if (gameMode === 'competitive' && teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
  }, [currentLevelIndex, gameMode, teams.length, setCurrentTeam]);

  useEffect(() => {
    setWrongAnswers([]);
    setAttemptedTeams(new Set());
  }, [currentLevelIndex]);

  // --- Centralized onCheck Logic ---
  const onCheck = useCallback(() => {
    if (gameState.gameState !== 'playing' || !currentLevel) return;

    const isCorrect = normalize(gameState.answerSlots.join('')) === normalize(solution);

    if (isCorrect) {
      dispatch({ type: 'SET_GAME_STATE', payload: 'won' });
      if (gameMode === 'competitive') {
        const points = getPoints(currentLevel);
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: 'success' });
        setTimeout(() => nextLevel(), 2000);
      } else {
        setNotification({ message: t.congrats, type: 'success' });
      }
    } else {
      dispatch({ type: 'SET_GAME_STATE', payload: 'failed' });
      const currentAnswer = gameState.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      setNotification({ message: t.wrongAnswer, type: 'error' });

      if (gameMode === 'competitive') {
        const newAttemptedTeams = new Set(attemptedTeams).add(currentTeam);
        setAttemptedTeams(newAttemptedTeams);
        if (newAttemptedTeams.size >= teams.length) {
          nextTurn('lose');
          setTimeout(() => {
            dispatch({ type: 'SHOW', solution, letters: gameState.letters });
            setNotification({ message: `${t.solutionWas}: ${solution}`, type: 'error' });
            setTimeout(() => nextLevel(), 2500);
          }, 2000);
        } else {
          nextTurn('lose');
          setTimeout(() => {
            dispatch({ type: 'CLEAR' });
            dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
          }, 2000);
        }
      } else {
        setTimeout(() => {
          dispatch({ type: 'CLEAR' });
          dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
        }, 2000);
      }
    }
  }, [
    gameState, currentLevel, solution, gameMode, teams, currentTeam, getPoints, wrongAnswers,
    updateScore, setNotification, nextTurn, nextLevel, dispatch, t, attemptedTeams
  ]);

  // --- Other Callbacks ---
  const onLetterClick = useCallback((index: number) => {
    if (gameState.gameState === 'playing') {
      dispatch({ type: 'PLACE', gridIndex: index, letter: gameState.letters[index] });
    }
  }, [gameState, dispatch]);

  const onRemove = useCallback(() => dispatch({ type: 'REMOVE_LAST' }), [dispatch]);
  const onClear = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);

  const onShow = useCallback(() => {
    // --- Added gameState.gameState to dependency array ---
    if (gameState.gameState !== 'playing') return;
    dispatch({ type: 'SHOW', solution, letters: gameState.letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: 'error' });
    if (gameMode === 'competitive') {
      nextTurn('lose');
      setTimeout(() => nextLevel(), 2500);
    } else {
      dispatch({ type: 'SET_GAME_STATE', payload: 'won' });
    }
  }, [dispatch, solution, gameState.letters, gameState.gameState, gameMode, nextTurn, nextLevel, setNotification, t.solutionWas]);

  const onHint = useCallback(() => {
    // --- Added gameState.gameState to dependency array ---
    if (gameState.gameState !== 'playing') return;
    if (gameMode === 'competitive' && !consumeHint(teams[currentTeam].id)) {
      setNotification({ message: t.noHintsLeft, type: 'error' });
      return;
    }
    dispatch({ type: 'HINT', solution, letters: gameState.letters });
  }, [dispatch, solution, gameState.letters, gameState.gameState, gameMode, consumeHint, teams, currentTeam, setNotification, t.noHintsLeft]);

  // --- Control State Logic ---
  const canRemove = useMemo(() => gameState.gameState === 'playing' && gameState.slotIndices.some(i => i !== null && !gameState.hintIndices.includes(i as number)), [gameState]);
  const canClear = useMemo(() => gameState.gameState === 'playing' && gameState.slotIndices.filter(i => i !== null).length > gameState.hintIndices.length, [gameState]);
  const canCheck = useMemo(() => gameState.gameState === 'playing' && gameState.answerSlots.every(ch => ch !== ''), [gameState]);
  const canHint = useMemo(() => {
    if (gameState.gameState !== 'playing') return false;
    return gameMode !== 'competitive' || (teams[currentTeam]?.hintsRemaining ?? 0) > 0;
  }, [gameState.gameState, gameMode, teams, currentTeam]);

  // --- Return everything needed ---
  return {
    loading, levels, currentLevel, currentLevelIndex, solution, notification,
    setNotification, gameState, dispatch, nextLevel, prevLevel, resetLevel,
    letters: gameState.letters, wrongAnswers,
    onLetterClick, onRemove, onClear, onCheck, onShow, onHint,
    canRemove, canClear, canCheck, canHint,
  };
}
