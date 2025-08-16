// src/features/clue-game/hooks/useClueGame.ts
import { useState, useEffect, useCallback, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useSolverWorker } from '@/hooks/useSolverWorker';
import { clueGameEngine, type Level } from '../engine';
import { generateLetters } from '@/lib/gameUtils';
import { reducer } from '@/components/game/gameReducer';
import type { State, Action } from '@/components/game/gameReducer';
import { useGameControls } from './useGameControls';

export function useClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty, gameMode, updateScore, currentTeam, setCurrentTeam, teams, nextTurn, consumeHint } = useGameMode();
  const { t } = useTranslation();
  const { findWords } = useSolverWorker();

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [],
    answerSlots: [],
    hintIndices: [],
    gameState: "playing",
  });

  const { canRemove, canClear, canCheck, canHint } = useGameControls(state);

  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  const resetLevel = useCallback(() => {
    if (!levels.length || !currentLevel) return;
    // FIX: Call the imported generateLetters function correctly
    setLetters(generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    dispatch({ type: "RESET", solutionLen: solution.length });
    setWrongAnswers([]);
    setNotification(null);
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
  }, [levels, currentLevel, currentLevelIndex, language, teams.length, setCurrentTeam, solution.length]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
    } else {
      navigate('/games');
    }
  }, [currentLevelIndex, levels.length, navigate]);
  
  const prevLevel = useCallback(() => {
    if (currentLevelIndex > 0) {
      setCurrentLevelIndex(i => i - 1);
    }
  }, [currentLevelIndex]);

  const onCheck = useCallback(() => {
    if (state.gameState !== 'playing') return;
    const isCorrect = state.answerSlots.join('') === solution;

    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const getPoints = () => {
        if (!currentLevel) return 0;
        switch (currentLevel.difficulty) {
          case "easy": return 10;
          case "medium": return 20;
          case "hard": return 30;
          default: return 10;
        }
      };
      const points = getPoints();
      if (gameMode === "competitive" && teams.length > 0) {
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: "success" });
      } else {
        setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      const currentAnswer = state.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      setNotification({ message: t.wrongAnswer, type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
        if (gameMode === 'competitive') {
          nextTurn("lose");
        }
      }, 2000);
    }
  }, [state.gameState, state.answerSlots, solution, currentLevel, gameMode, teams, currentTeam, updateScore, nextTurn, t.congrats, t.wrongAnswer, wrongAnswers]);

  const onShow = useCallback(() => {
    if (state.gameState !== 'playing') return;
    dispatch({ type: "SHOW", solution, letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: "error" });
    if (gameMode === 'competitive') {
      setTimeout(() => {
        nextTurn('lose');
        nextLevel();
      }, 2500);
    }
  }, [state.gameState, solution, letters, gameMode, nextTurn, nextLevel, t.solutionWas]);

  const onLetterClick = useCallback((i: number) => {
    if (state.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [state.gameState, letters]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const onHint = useCallback(() => {
    if (gameMode === "competitive" && teams.length > 0) {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification({ message: t.noHintsLeft, type: "error" });
        setTimeout(() => setNotification(null), 2000);
        return;
      }
    }
    dispatch({ type: "HINT", solution, letters });
  }, [gameMode, teams, currentTeam, consumeHint, t.noHintsLeft, solution, letters]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  const handleRevealOrListSolutions = useCallback(async () => {
    try {
      const category = categories.includes('general') ? 'animals' : categories[0];
      const sols = await findWords(letters, language, category, 2);
      if (sols && sols.length > 0) {
        const exact = sols.find(s => s.replace(/\s/g, '') === solution.replace(/\s/g, ''));
        if (exact) {
          dispatch({ type: 'SHOW', solution, letters });
          return;
        }
        setNotification({ message: `${sols.slice(0, 5).join(', ')}`, type: 'success' });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({ message: t.unknown ?? 'No suggestions', type: 'error' });
        setTimeout(() => setNotification(null), 2000);
      }
    } catch (err) {
      console.error("Solver worker failed:", err);
      setNotification({ message: t.unknown ?? 'No suggestions', type: 'error' });
      setTimeout(() => setNotification(null), 2000);
    }
  }, [findWords, letters, language, categories, solution, t.unknown]);

  useEffect(() => {
    setLoading(true);
    // FIX: Use the engine instance to load levels
    clueGameEngine.loadLevels({ language, categories, difficulty })
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories, difficulty]);

  useEffect(() => {
    if (levels.length > 0) resetLevel();
  }, [currentLevelIndex, levels, resetLevel]);

  return {
    loading,
    currentLevel,
    solution,
    letters,
    notification,
    wrongAnswers,
    gameState: state.gameState,
    answerSlots: state.answerSlots,
    slotIndices: state.slotIndices,
    hintIndices: state.hintIndices,
    currentLevelIndex,
    levels,
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
