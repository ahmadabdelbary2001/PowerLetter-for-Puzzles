// src/features/word-choice-game/hooks/useWordChoice.ts
/**
 * useWordChoiceGame hook - Manages state and logic for the word choice puzzle game for kids
 * Handles game initialization, player actions, and game flow for a kid-friendly multiple choice experience
 * Simplified compared to the regular clue game with automatic level progression
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useGame } from '@/hooks/useGame'; // Import the generic hook
import { wordChoiceGameEngine, type WordChoiceLevel } from '../engine';
import { shuffleArray } from '@/lib/gameUtils';

/**
 * Custom hook for managing the Word Choice Game state and logic
 * Provides game state, actions, and callbacks for the Word Choice Game component
 * Designed specifically for children with simplified gameplay and visual/audio cues
 */
export function useWordChoiceGame() {
  // Navigation
  const navigate = useNavigate();

  // Game mode and settings
  const { language, categories } = useGameMode();

  // --- Generic Game State ---
  // Use the generic game hook for common game functionality
  const { loading, currentLevel, nextLevel } = useGame<WordChoiceLevel>(
    wordChoiceGameEngine,
    { language, categories }
  );

  // --- Word-Choice Specific State ---
  // Shuffled word options for the player to choose from
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  // Currently selected option by the player
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  // Status of the current answer (idle, correct, incorrect)
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
  // Reference to the audio element for playing sound clues
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Word-Choice Specific Callbacks ---
  // Function to get the full path to an asset file
  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  // Function to play the audio clue
  const playSound = useCallback(() => {
    audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
  }, []);

  // Handle option selection
  const handleOptionClick = useCallback((option: string) => {
    // Prevent interaction if already processing a correct answer or no level loaded
    if (!currentLevel) return;
    if (answerStatus === 'correct') return;

    // Set the selected option
    setSelectedOption(option);

    // Check if the selected option is correct
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
      // Automatically move to next level after a short delay
      setTimeout(() => {
        nextLevel();
      }, 1200);
    } else {
      // Mark incorrect, show feedback, then revert to idle so player can try again
      setAnswerStatus('incorrect');
      setTimeout(() => setAnswerStatus('idle'), 1200);
    }
  }, [answerStatus, currentLevel, nextLevel]);

  // Handle navigation back to kids games selection
  const handleBack = useCallback(() => navigate('/kids-games'), [navigate]);

  // --- Effects ---
  // Effect to shuffle options when a new level is loaded
  useEffect(() => {
    if (currentLevel) {
      // Create a shuffled copy of the options array
      setShuffledOptions(shuffleArray([...currentLevel.options]));
      // Reset answer status and selection
      setAnswerStatus('idle');
      setSelectedOption(null);
    }
  }, [currentLevel]);

  // Return all the state and functions needed by the component
  return {
    loading,
    currentLevel,
    shuffledOptions,
    answerStatus,
    selectedOption,
    audioRef,
    getAssetPath,
    playSound,
    handleOptionClick,
    nextLevel,
    handleBack,
  };
}
