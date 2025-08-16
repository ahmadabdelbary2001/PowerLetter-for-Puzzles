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
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
        if (gameMode === 'competitive') nextTurn("lose");
      }, 2000);
    }
  }, [gameState, solution, currentLevel, gameMode, teams, currentTeam, updateScore, nextTurn, t, wrongAnswers, dispatch, setNotification]);

  const onShow = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    dispatch({ type: "SHOW", solution, letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: "error" });
    if (gameMode === 'competitive') {
      setTimeout(() => {
        nextTurn('lose');
        nextLevel();
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
  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);
  const prevLevel = useCallback(() => { if (currentLevelIndex > 0) { /* ... */ } }, [currentLevelIndex]);

  // --- Effects ---
  useEffect(() => {
    if (currentLevel && clueGameEngine.generateLetters) {
      setLetters(clueGameEngine.generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    }
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
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
