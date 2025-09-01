// src/features/clue-game/hooks/useClueGame.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { clueGameEngine, type Level } from '../engine';
import { useGameControls } from './useGameControls';

export function useClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const gameModeState = useGameMode();
  const { language, categories, difficulty, gameMode, updateScore, currentTeam, setCurrentTeam, teams, nextTurn, consumeHint } = gameModeState;
  const { t } = useTranslation();

  // --- Generic Game State ---
  const { loading, levels, currentLevel, currentLevelIndex, solution, notification, setNotification, gameState, dispatch, nextLevel, resetLevel } = useGame<Level>(
    clueGameEngine,
    { language, categories, difficulty }
  );

  // --- Clue-Game Specific State ---
  const [letters, setLetters] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set()); // Track which teams have attempted the current question
  const { canRemove, canClear, canCheck, canHint } = useGameControls(gameState);

  // --- Clue-Game Specific Callbacks ---
  const onLetterClick = useCallback((i: number) => {
    if (gameState.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [gameState.gameState, letters, dispatch]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), [dispatch]);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch]);

  const onCheck = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    const isCorrect = gameState.answerSlots.join('') === solution;

    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const points = currentLevel?.difficulty === 'medium' ? 20 : currentLevel?.difficulty === 'hard' ? 30 : 10;
      if (gameMode === "competitive") {
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: "success" });
        // In competitive mode, automatically move to next level after a correct answer
        setTimeout(() => {
          nextLevel();
          // Reset the game state to playing for the next level
          dispatch({ type: "SET_GAME_STATE", payload: "playing" });
          setNotification(null);
        }, 2000);
      } else {
        setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      const currentAnswer = gameState.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      setNotification({ message: t.wrongAnswer, type: "error" });

      // Track which teams have attempted the question in competitive mode
      if (gameMode === 'competitive') {
        // Add current team to attempted teams
        const newAttemptedTeams = new Set(attemptedTeams);
        newAttemptedTeams.add(currentTeam);
        setAttemptedTeams(newAttemptedTeams);

        // Check if all teams have attempted the question
        if (newAttemptedTeams.size === teams.length) {
          // All teams have attempted and failed, show solution and move to next level
          setTimeout(() => {
            dispatch({ type: "SHOW", solution, letters });
            setNotification({ message: `${t.solutionWas}: ${solution}`, type: "error" });
            // Reset attempted teams for the next question
            setAttemptedTeams(new Set());
            // Move to next level after showing solution
            setTimeout(() => {
              nextLevel();
              dispatch({ type: "SET_GAME_STATE", payload: "playing" });
              setNotification(null);
            }, 2500);
          }, 2000);
        } else {
          // Not all teams have attempted yet, just pass to next team
          setTimeout(() => {
            dispatch({ type: "CLEAR" });
            dispatch({ type: "SET_GAME_STATE", payload: "playing" });
            setNotification(null);
            nextTurn("lose");
          }, 2000);
        }
      } else {
        // Non-competitive mode behavior
        setTimeout(() => {
          dispatch({ type: "CLEAR" });
          dispatch({ type: "SET_GAME_STATE", payload: "playing" });
          setNotification(null);
        }, 2000);
      }
    }
  }, [gameState, solution, currentLevel, gameMode, teams, currentTeam, updateScore, nextTurn, nextLevel, t, wrongAnswers, dispatch, setNotification, attemptedTeams, letters]);

  const onShow = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    dispatch({ type: "SHOW", solution, letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: "error" });
    if (gameMode === 'competitive') {
      setTimeout(() => {
        nextTurn('lose');
        // Automatically move to next level without showing the "Next" button
        nextLevel();
        // Reset the game state to playing for the next level
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
      }, 2500);
    }
  }, [gameState.gameState, solution, letters, gameMode, nextTurn, nextLevel, t.solutionWas, dispatch, setNotification]);

  const onHint = useCallback(() => {
    if (gameMode === "competitive" && !consumeHint(teams[currentTeam].id)) {
      setNotification({ message: t.noHintsLeft, type: "error" });
      setTimeout(() => setNotification(null), 2000);
      return;
    }
    dispatch({ type: "HINT", solution, letters });
  }, [gameMode, teams, currentTeam, consumeHint, t.noHintsLeft, solution, letters, dispatch, setNotification]);

  const handleRevealOrListSolutions = useCallback(async () => { /* ... unchanged ... */ }, [/* ... */]);
  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${params.gameType}`);
    } else {
      navigate(`/game-mode/${params.gameType}`);
    }
  }, [navigate, params.gameType, gameMode]);
  const prevLevel = useCallback(() => {
    if (currentLevelIndex > 0) {
      // Fix: There's no setCurrentLevelIndex function, need to use resetLevel with the previous index
      resetLevel();
    }
  }, [currentLevelIndex, resetLevel]);

  // --- Effects ---
  useEffect(() => {
    if (currentLevel && clueGameEngine.generateLetters) {
      setLetters(clueGameEngine.generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    }
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
    // Clear wrong answers when moving to a new level
    setWrongAnswers([]);
  }, [currentLevel, language, teams.length, currentLevelIndex, setCurrentTeam]);

  return {
    loading,
    levels,
    currentLevel,
    solution,
    letters,
    notification,
    wrongAnswers,
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
    handleRevealOrListSolutions,
    resetLevel,
    canRemove,
    canClear,
    canCheck,
    canHint,
  };
}
