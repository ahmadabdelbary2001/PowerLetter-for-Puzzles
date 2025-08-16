// src/features/img-clue-game/hooks/useImageClueGame.ts
import { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { loadImageClueLevels, generateLetters } from '../engine';
import type { ImageLevel } from '../engine';
import { reducer } from '@/components/game/gameReducer';
import type { State, Action } from '@/components/game/gameReducer';

export function useImageClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, gameMode, updateScore, currentTeam, setCurrentTeam, teams, nextTurn } = useGameMode();
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [],
    answerSlots: [],
    hintIndices: [],
    gameState: "playing",
  });

  const [levels, setLevels] = useState<ImageLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  // --- Asset and Sound Handling ---
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const assetPath = path.replace(/^\//, '');
    return `${baseUrl}/${assetPath}`;
  };

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  // --- Core Game Logic Callbacks ---
  const resetLevel = useCallback(() => {
    if (!levels.length || !currentLevel) return;
    setLetters(generateLetters(currentLevel.solution, language));
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
  }, [levels, currentLevel, currentLevelIndex, language, teams.length, setCurrentTeam, solution.length]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
    } else {
      // Navigate back to the selection screen when all levels are done
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const onCheck = useCallback(() => {
    if (state.gameState !== 'playing') return;
    const isCorrect = state.answerSlots.join('') === solution;

    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const points = 10; // All kids' levels are worth 10 points
      if (gameMode === "competitive" && teams.length > 0) {
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: "success" });
      } else {
        setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: t.wrongAnswer, type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
        if (gameMode === 'competitive') {
          nextTurn("lose");
        }
      }, 1500);
    }
  }, [state.gameState, state.answerSlots, solution, gameMode, teams, currentTeam, updateScore, nextTurn, t.congrats, t.wrongAnswer]);

  // --- UI Interaction Callbacks ---
  const onLetterClick = useCallback((i: number) => {
    if (state.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [state.gameState, letters]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  
  // FIX: The back button now correctly uses the gameType from the URL parameters.
  const handleBack = useCallback(() => {
    navigate(`/game-mode/${params.gameType}`);
  }, [navigate, params.gameType]);

  // --- Data Loading Effect ---
  useEffect(() => {
    setLoading(true);
    loadImageClueLevels(language, categories)
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  // --- Level Reset Effect ---
  useEffect(() => {
    if (levels.length > 0) {
      resetLevel();
    }
  }, [currentLevelIndex, levels, resetLevel]);

  // Return all the state and functions the UI component needs
  return {
    loading,
    levels,
    currentLevel,
    solution,
    letters,
    notification,
    audioRef,
    gameState: state.gameState,
    answerSlots: state.answerSlots,
    slotIndices: state.slotIndices,
    hintIndices: state.hintIndices,
    getAssetPath,
    playSound,
    onCheck,
    onLetterClick,
    onRemove,
    onClear,
    nextLevel,
    handleBack,
  };
}
