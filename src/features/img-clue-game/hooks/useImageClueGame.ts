// src/features/img-clue-game/hooks/useImageClueGame.ts
import { useReducer, useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameMode } from "@/hooks/useGameMode";
import { reducer, type State, type Action } from "@/components/game/gameReducer";
import { imgClueGameEngine, type ImageLevel } from "../engine";
import { generateLetters } from "@/lib/gameUtils";

export function useImageClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories } = useGameMode();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [], answerSlots: [], hintIndices: [], gameState: "playing",
  });

  const [levels, setLevels] = useState<ImageLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

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

  const resetLevel = useCallback(() => {
    if (!levels.length || !currentLevel) return;
    // FIX: Call the imported generateLetters function correctly
    setLetters(generateLetters(currentLevel.solution, 'easy', language, true));
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
  }, [levels, currentLevel, language, solution.length]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
    } else {
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const onCheck = useCallback(() => {
    // This logic can be expanded for competitive mode later if needed
    if (state.gameState !== 'playing') return;
    const isCorrect = state.answerSlots.join('') === solution;
    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      setNotification({ message: "Correct!", type: "success" });
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: "Try again!", type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
      }, 1500);
    }
  }, [state.gameState, state.answerSlots, solution]);

  const handleBack = useCallback(() => {
    navigate(`/game-mode/${params.gameType}`);
  }, [navigate, params.gameType]);

  useEffect(() => {
    setLoading(true);
    imgClueGameEngine.loadLevels({ language, categories })
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  useEffect(() => {
    if (levels.length > 0) resetLevel();
  }, [currentLevelIndex, levels, resetLevel]);

  const onLetterClick = useCallback((i: number) => {
    if (state.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [state.gameState, letters]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);

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
