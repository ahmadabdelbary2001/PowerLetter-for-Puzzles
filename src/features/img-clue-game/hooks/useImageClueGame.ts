// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * useImageClueGame hook - Cloned behavior from the Clue game's hook
 * Handles image-clue-specific gameplay while following the same rotation/competitive
 * algorithm used in the Clue game (nextTurn calls occur inside this hook).
 *
 * Behavior differences implemented:
 * - Competitive mode: award +1 point, call nextTurn('win'|'lose'), and auto-advance to next question.
 * - Solo mode: do NOT auto-advance after correct answer; leave state as 'won' and let UI's Next button advance.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { imgClueGameEngine, type ImageLevel } from '../engine';
import { useGameControls } from '../../clue-game/hooks/useGameControls';

export function useImageClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const gameModeState = useGameMode();
  const {
    language,
    categories,
    difficulty,
    gameMode,
    updateScore,
    currentTeam,
    setCurrentTeam,
    teams,
    nextTurn,
    consumeHint,
  } = gameModeState;

  const { t } = useTranslation();

  // Generic game state via useGame
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
    resetLevel,
  } = useGame<ImageLevel>(imgClueGameEngine, { language, categories, difficulty });

  // Image-clue specific state
  const [letters, setLetters] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());
  const { canRemove, canClear, canCheck, canHint } = useGameControls(gameState);

  // audio ref for image-clue sounds
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // timeouts
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // helpers
  const normalize = (s = '') => String(s).replace(/\s+/g, '').toLowerCase();

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const getAssetPath = (path: string) => {
    const base = (import.meta).env?.BASE_URL ?? '/';
    const baseUrl = String(base).replace(/\/+$/, '');
    const normalized = path.replace(/^\/+/, '');
    return `${baseUrl}/${normalized}`;
  };

  const playSound = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.play().catch((e) => console.error('Audio play failed:', e));
  }, []);

  // Actions
  const onLetterClick = useCallback(
    (i: number) => {
      if (gameState.gameState !== 'playing') return;
      const letter = letters[i];
      if (!letter) return;
      dispatch({ type: 'PLACE', gridIndex: i, letter });
    },
    [gameState.gameState, letters, dispatch]
  );

  const onRemove = useCallback(() => dispatch({ type: 'REMOVE_LAST' }), [dispatch]);
  const onClear = useCallback(() => dispatch({ type: 'CLEAR' }), [dispatch]);

  // Prev level helper — best-effort parity with clue hook
  const prevLevel = useCallback(() => {
    // We don't have direct setter for currentLevelIndex in useGame; keep resetLevel for now.
    resetLevel();
  }, [resetLevel]);

  const onCheck = useCallback(() => {
    if (gameState.gameState !== 'playing') return;

    const currentAnswer = (gameState.answerSlots || []).join('');
    const isCorrect = normalize(currentAnswer) === normalize(solution);

    if (isCorrect) {
      dispatch({ type: 'SET_GAME_STATE', payload: 'won' });

      // Competitive: award +1 and rotate/auto-advance (like Clue)
      if (gameMode === 'competitive') {
        if (teams && typeof currentTeam === 'number' && teams[currentTeam]) {
          try {
            updateScore(teams[currentTeam].id, 1);
          } catch (e) {
            console.error('updateScore failed:', e);
          }
          setNotification({ message: `${t.congrats} +1`, type: 'success' });
        } else {
          setNotification({ message: t.congrats, type: 'success' });
        }

        // Rotate players here (hook-level)
        if (typeof nextTurn === 'function') {
          try {
            nextTurn('win');
          } catch (e) {
            console.error("nextTurn('win') failed:", e);
          }
        }

        // Auto-advance after short delay (competitive)
        clearPendingTimeout();
        timeoutRef.current = setTimeout(() => {
          nextLevel();
          dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
          setNotification(null);
          timeoutRef.current = null;
        }, 1500);
      } else {
        // Solo mode: do NOT auto-advance. Leave state as 'won' so UI shows Next button.
        setNotification({ message: t.congrats, type: 'success' });
        // Do not call nextLevel automatically here.
      }
    } else {
      // incorrect
      dispatch({ type: 'SET_GAME_STATE', payload: 'failed' });

      // Record wrong attempt (avoid duplicates & empty)
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers((prev) => [...prev, currentAnswer]);
      }

      setNotification({ message: t.wrongAnswer, type: 'error' });

      if (gameMode === 'competitive') {
        // add current team to attempted list
        const newAttempted = new Set(attemptedTeams);
        newAttempted.add(currentTeam);
        setAttemptedTeams(newAttempted);

        // If all teams attempted, reveal and move on
        clearPendingTimeout();
        timeoutRef.current = setTimeout(() => {
          if (teams.length > 0 && newAttempted.size >= teams.length) {
            dispatch({ type: 'SHOW', solution, letters });
            setNotification({ message: `${t.solutionWas}: ${solution}`, type: 'error' });
            // reset attempted teams
            setAttemptedTeams(new Set());
            clearPendingTimeout();
            timeoutRef.current = setTimeout(() => {
              nextLevel();
              dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
              setNotification(null);
              timeoutRef.current = null;
            }, 2500);
          } else {
            // not all teams attempted: pass turn to next team using nextTurn('lose'), then clear board
            dispatch({ type: 'CLEAR' });
            dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
            setNotification(null);
            try {
              if (typeof nextTurn === 'function') nextTurn('lose');
            } catch (e) {
              console.error("nextTurn('lose') failed:", e);
            }
            timeoutRef.current = null;
          }
        }, 2000);
      } else {
        // solo: clear answer and continue on same question after a short delay
        clearPendingTimeout();
        timeoutRef.current = setTimeout(() => {
          dispatch({ type: 'CLEAR' });
          dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
          setNotification(null);
          timeoutRef.current = null;
        }, 2000);
      }
    }
  }, [
    gameState,
    gameMode,
    teams,
    currentTeam,
    attemptedTeams,
    wrongAnswers,
    dispatch,
    nextLevel,
    nextTurn,
    updateScore,
    solution,
    letters,
    setNotification,
    t,
    clearPendingTimeout,
  ]);

  const onShow = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    dispatch({ type: 'SHOW', solution, letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: 'error' });

    if (gameMode === 'competitive') {
      clearPendingTimeout();
      timeoutRef.current = setTimeout(() => {
        try {
          if (typeof nextTurn === 'function') nextTurn('lose');
        } catch (e) {
          console.error("nextTurn('lose') failed:", e);
        }
        nextLevel();
        dispatch({ type: 'SET_GAME_STATE', payload: 'playing' });
        setNotification(null);
        timeoutRef.current = null;
      }, 2500);
    }
  }, [gameState.gameState, solution, letters, gameMode, nextTurn, nextLevel, dispatch, setNotification, t, clearPendingTimeout]);

  const onHint = useCallback(() => {
    if (gameMode === 'competitive') {
      const team = teams?.[currentTeam];
      const ok = team ? consumeHint(team.id) : false;
      if (!ok) {
        setNotification({ message: t.noHintsLeft, type: 'error' });
        clearPendingTimeout();
        timeoutRef.current = setTimeout(() => setNotification(null), 2000);
        return;
      }
    }
    dispatch({ type: 'HINT', solution, letters });
  }, [gameMode, teams, currentTeam, consumeHint, dispatch, solution, letters, setNotification, t, clearPendingTimeout]);

  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${params.gameType}`);
    } else {
      navigate(`/game-mode/${params.gameType}`);
    }
  }, [gameMode, navigate, params.gameType]);

  // Effects
  useEffect(() => {
    if (currentLevel && imgClueGameEngine.generateLetters) {
      // kids mode: always easy
      setLetters(imgClueGameEngine.generateLetters(currentLevel.solution, 'easy', language));
    } else {
      setLetters([]);
    }

    // set the current team depending on teams
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }

    // clear wrong answers and attempted teams when moving to a new level
    setWrongAnswers([]);
    setAttemptedTeams(new Set());

    // reset reducer board for the new level
    resetLevel();
  }, [currentLevel, language, teams.length, currentLevelIndex, setCurrentTeam, resetLevel]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      clearPendingTimeout();
    };
  }, [clearPendingTimeout]);

  return {
    loading,
    levels,
    currentLevel,
    solution,
    letters,
    notification,
    wrongAnswers,
    attemptedTeams,
    gameState: gameState.gameState,
    answerSlots: gameState.answerSlots,
    slotIndices: gameState.slotIndices,
    hintIndices: gameState.hintIndices,
    currentLevelIndex,
    onCheck,
    onShow,
    onLetterClick,
    onRemove,
    onClear,
    onHint,
    nextLevel,
    prevLevel,
    handleBack,
    audioRef,
    getAssetPath,
    playSound,
    canRemove,
    canClear,
    canCheck,
    canHint,
  };
}
