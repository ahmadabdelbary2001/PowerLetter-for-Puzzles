// src/features/img-clue-game/hooks/useImageClueGame.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameMode } from "@/hooks/useGameMode";
import { useGame } from "@/hooks/useGame"; // Import the generic hook
import { imgClueGameEngine, type ImageLevel } from "../engine";
import { useTranslation } from "@/hooks/useTranslation";

export function useImageClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories } = useGameMode();
  const { t } = useTranslation();

  // --- Generic Game State ---
  const { loading, levels, currentLevel, solution, notification, setNotification, gameState, dispatch, nextLevel } = useGame<ImageLevel>(
    imgClueGameEngine,
    { language, categories }
  );

  // --- Image-Clue Specific State ---
  const [letters, setLetters] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Image-Clue Specific Callbacks ---
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
  }, []);

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
      setNotification({ message: t.congrats, type: "success" });
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: t.wrongAnswer, type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
      }, 1500);
    }
  }, [gameState, solution, t, dispatch, setNotification]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  // --- Effects ---
  useEffect(() => {
    if (currentLevel && imgClueGameEngine.generateLetters) {
      setLetters(imgClueGameEngine.generateLetters(currentLevel.solution, 'easy', language));
    }
  }, [currentLevel, language]);

  return {
    loading,
    levels,
    currentLevel,
    solution,
    letters,
    notification,
    audioRef,
    gameState: gameState.gameState,
    answerSlots: gameState.answerSlots,
    slotIndices: gameState.slotIndices,
    hintIndices: gameState.hintIndices,
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
