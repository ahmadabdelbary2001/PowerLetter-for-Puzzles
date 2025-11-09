// src/hooks/game/useClueGame.ts
/**
 * @description A specialized "mixin" hook for "clue-style" games.
 * --- It is now a PURE mixin that does not call any global state hooks directly. ---
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { GameLevel, Difficulty } from '@/types/game';
import type { useGameController } from './useGameController';

const normalize = (s: string) => s.toLowerCase().trim();

type GameController<T extends GameLevel & { solution: string; difficulty?: Difficulty }> = ReturnType<typeof useGameController<T>>;

interface ClueGameMixinOptions<T> {
  getPoints?: (level: T) => number;
}

export function useClueGame<T extends GameLevel & { solution: string; difficulty?: Difficulty; }> (
  controller: GameController<T>,
  options: ClueGameMixinOptions<T> = {}
) {
  const { getPoints = () => 1 } = options;

  // --- Destructure everything from the controller object. ---
  const {
    gameState, currentLevel, solution, dispatch, setNotification, nextLevel,
    gameModeState, // Get the full gameMode state object from the controller.
  } = controller;

  // --- Destructure the specific functions needed from gameModeState. ---
  const { gameMode, teams, currentTeam, setCurrentTeam, updateScore, nextTurn, consumeHint } = gameModeState;

  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (gameMode === 'competitive' && teams.length > 0) {
      setCurrentTeam(controller.currentLevelIndex % teams.length);
    }
  }, [controller.currentLevelIndex, gameMode, teams.length, setCurrentTeam]);

  useEffect(() => {
    setWrongAnswers([]);
    setAttemptedTeams(new Set());
  }, [controller.currentLevelIndex]);

  const onCheck = useCallback(() => {
    if (gameState.gameState !== 'playing' || !currentLevel) return;
    const isCorrect = normalize(gameState.answerSlots.join('')) === normalize(solution);
    if (isCorrect) {
      dispatch({ type: 'SET_GAME_STATE', payload: 'won' });
      if (gameMode === 'competitive') {
        const points = getPoints(currentLevel as T);
        updateScore(teams[currentTeam].id, points);
        // --- Use the specific 'congrats' key. The points can be added in the UI if needed, but this is cleaner. ---
        setNotification({ messageKey: 'congrats', type: 'success' });
        setTimeout(() => nextLevel(), 2000);
      } else {
        // --- Use the specific 'congrats' key. ---
        setNotification({ messageKey: 'congrats', type: 'success' });
      }
    } else {
      dispatch({ type: 'SET_GAME_STATE', payload: 'failed' });
      const currentAnswer = gameState.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      // --- Use the specific 'wrongAnswer' key. ---
      setNotification({ messageKey: 'wrongAnswer', type: 'error' });
      if (gameMode === 'competitive') {
        const newAttemptedTeams = new Set(attemptedTeams).add(currentTeam);
        setAttemptedTeams(newAttemptedTeams);
        if (newAttemptedTeams.size >= teams.length) {
          nextTurn('lose');
          setTimeout(() => {
            dispatch({ type: 'SHOW', solution, letters: gameState.letters });
            // --- FIX: Use the 'solutionWas' key and pass the solution for interpolation. ---
            setNotification({ messageKey: 'solutionWas', options: { solution }, type: 'error' });
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
    updateScore, setNotification, nextTurn, nextLevel, dispatch, attemptedTeams
  ]);

  const onLetterClick = useCallback((index: number) => {
    if (gameState.gameState === 'playing') {
      dispatch({ type: 'PLACE', gridIndex: index, letter: gameState.letters[index] });
    }
  }, [gameState, dispatch]);
  const onRemove = useCallback(() => dispatch({ type: 'REMOVE_LAST' }), [dispatch]);
  const onClear = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);
  const onShow = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    dispatch({ type: 'SHOW', solution, letters: gameState.letters });
    // --- Use the 'solutionWas' key and pass the solution for interpolation. ---
    setNotification({ messageKey: 'solutionWas', options: { solution }, type: 'error' });
    if (gameMode === 'competitive') {
      nextTurn('lose');
      setTimeout(() => nextLevel(), 2500);
    } else {
      dispatch({ type: 'SET_GAME_STATE', payload: 'won' });
    }
  }, [dispatch, solution, gameState, gameMode, nextTurn, nextLevel, setNotification]);

  const onHint = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    if (gameMode === 'competitive' && !consumeHint(teams[currentTeam].id)) {
      // --- Use the specific 'noMoreHints' key. ---
      setNotification({ messageKey: 'noMoreHints', type: 'error' });
      return;
    }
    dispatch({ type: 'HINT', solution, letters: gameState.letters });
  }, [dispatch, solution, gameState, gameMode, consumeHint, teams, currentTeam, setNotification]);

  const canRemove = useMemo(() => gameState.gameState === 'playing' && gameState.slotIndices.some(i => i !== null && !gameState.hintIndices.includes(i as number)), [gameState]);
  const canClear = useMemo(() => gameState.gameState === 'playing' && gameState.slotIndices.filter(i => i !== null).length > gameState.hintIndices.length, [gameState]);
  const canCheck = useMemo(() => gameState.gameState === 'playing' && gameState.answerSlots.every(ch => ch !== ''), [gameState]);
  const canHint = useMemo(() => {
    if (gameState.gameState !== 'playing') return false;
    return gameMode !== 'competitive' || (teams[currentTeam]?.hintsRemaining ?? 0) > 0;
  }, [gameState.gameState, gameMode, teams, currentTeam]);

  return {
    ...controller,
    wrongAnswers,
    onLetterClick, onRemove, onClear, onCheck, onShow, onHint,
    canRemove, canClear, canCheck, canHint,
    gameMode,
  };
}
