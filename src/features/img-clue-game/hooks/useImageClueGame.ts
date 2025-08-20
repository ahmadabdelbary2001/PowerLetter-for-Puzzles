// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * useImageClueGame hook - Manages state and logic for the image clue puzzle game for kids
 * Handles game initialization, player actions, and game flow for a kid-friendly experience
 * Simplified compared to the regular clue game with automatic level progression
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameMode } from "@/hooks/useGameMode";
import { useGame } from "@/hooks/useGame"; // Import the generic hook
import { imgClueGameEngine, type ImageLevel } from "../engine";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Custom hook for managing the Image Clue Game state and logic
 * Provides game state, actions, and callbacks for the Image Clue Game component
 * Designed specifically for children with simplified gameplay and visual/audio cues
 */
export function useImageClueGame() {
  // Navigation and routing
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();

  // Game mode and settings
  const { language, categories } = useGameMode();

  // Translation
  const { t } = useTranslation();

  // --- Generic Game State ---
  // Use the generic game hook for common game functionality
  const { loading, levels, currentLevel, solution, notification, setNotification, gameState, dispatch, nextLevel } = useGame<ImageLevel>(
    imgClueGameEngine,
    { language, categories }
  );

  // --- Image-Clue Specific State ---
  // Available letters for the player to choose from
  const [letters, setLetters] = useState<string[]>([]);
  // Reference to the audio element for playing sound clues
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Image-Clue Specific Callbacks ---
  // Function to get the full path to an asset file
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  // Function to play the audio clue
  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
  }, []);

  // Handle letter selection from the letter grid
  const onLetterClick = useCallback((i: number) => {
    if (gameState.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [gameState.gameState, letters, dispatch]);

  // Handle removing the last placed letter
  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), [dispatch]);

  // Handle clearing all placed letters
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), [dispatch]);

  // Handle checking if the current answer is correct
  const onCheck = useCallback(() => {
    if (gameState.gameState !== 'playing') return;
    const isCorrect = gameState.answerSlots.join('') === solution;

    if (isCorrect) {
      // Handle correct answer
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      setNotification({ message: t.congrats, type: "success" });
    } else {
      // Handle incorrect answer
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: t.wrongAnswer, type: "error" });

      // Automatically clear the answer and reset to playing state after a delay
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
      }, 1500);
    }
  }, [gameState, solution, t, dispatch, setNotification]);

  // Handle navigation back to game mode selection
  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  // --- Effects ---
  // Effect to generate letter options when a new level is loaded
  useEffect(() => {
    if (currentLevel && imgClueGameEngine.generateLetters) {
      // Always use 'easy' difficulty for kids
      setLetters(imgClueGameEngine.generateLetters(currentLevel.solution, 'easy', language));
    }
  }, [currentLevel, language]);

  // Return all the state and functions needed by the component
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
