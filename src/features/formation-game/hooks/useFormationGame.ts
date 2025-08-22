// src/features/formation-game/hooks/useFormationGame.ts
/**
 * @description Custom hook to manage the state and logic for the Word Formation game.
 * This hook handles all game state, user interactions, and game logic for the crossword puzzle game.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { formationGameEngine, type FormationLevel } from '../engine';

/**
 * Custom hook that manages the state and logic for the Word Formation game.
 * Handles level loading, letter selection, word validation, hint system, and game progression.
 * 
 * @returns Object containing game state and handler functions
 */
export function useFormationGame() {
  // Navigation and routing
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();

  // Game configuration
  const { language, categories, difficulty } = useGameMode();
  const { t } = useTranslation();

  // Game level management
  const { loading, currentLevel, currentLevelIndex, nextLevel } = useGame<FormationLevel>(
    formationGameEngine,
    { language, categories, difficulty }
  );

  // Game state
  const [letters, setLetters] = useState<string[]>([]);                    // Available letters for forming words
  const [currentInput, setCurrentInput] = useState<string>("");           // Current word being formed by the player
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());   // Set of words the player has found
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set()); // Set of revealed cell coordinates
  const [notification, setNotification] = useState<string | null>(null);   // Notification message to display
  const [usedLetterIndices, setUsedLetterIndices] = useState<Set<number>>(new Set()); // Indices of used letters

  /**
   * Initialize game state when a new level is loaded
   */
  useEffect(() => {
    if (currentLevel) {
      // Generate shuffled letters for the current level
      if (formationGameEngine.generateLetters) {
        setLetters(formationGameEngine.generateLetters("", currentLevel.difficulty, language, currentLevel.baseLetters));
      }
      // Reset game state
      setFoundWords(new Set());
      setCurrentInput("");
      setRevealedCells(new Set());
      setUsedLetterIndices(new Set());
    }
  }, [currentLevel, language]);

  /**
   * Handles letter selection when a player clicks on a letter
   * @param letter - The selected letter
   * @param index - The index of the letter in the letters array (optional)
   */
  const onLetterSelect = useCallback((letter: string, index?: number) => {
    setCurrentInput(prev => prev + letter);
    if (index !== undefined) {
      // Track which letter has been used to prevent reuse
      setUsedLetterIndices(prev => new Set(prev).add(index));
    }
  }, []);

  /**
   * Handles removal of the last letter from the current input
   * Also makes the letter available for use again
   */
  const onRemoveLast = useCallback(() => {
    setCurrentInput(prev => {
      if (prev.length === 0) return prev;

      // Find the last letter in the input and make it available again
      const lastLetter = prev.slice(-1);
      // Find the index of this letter in the original letters array
      // We need to find the most recently used occurrence of this letter
      let foundIndex = -1;
      const usedIndicesArray = Array.from(usedLetterIndices);

      // Iterate backwards to find the most recent usage
      for (let i = usedIndicesArray.length - 1; i >= 0; i--) {
        const idx = usedIndicesArray[i];
        if (letters[idx] === lastLetter) {
          foundIndex = idx;
          break;
        }
      }

      if (foundIndex !== -1) {
        setUsedLetterIndices(prev => {
          const newSet = new Set(prev);
          newSet.delete(foundIndex);
          return newSet;
        });
      }

      return prev.slice(0, -1);
    });
  }, [letters, usedLetterIndices]);

  /**
   * Shuffles the available letters
   */
  const onShuffle = useCallback(() => {
    setLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  /**
   * Validates the current input word and updates game state accordingly
   */
  const onCheckWord = useCallback(() => {
    if (!currentLevel || currentInput.length === 0) return;

    const solutionWords = currentLevel.words;

    // Check if the word is valid and hasn't been found yet
    if (solutionWords.includes(currentInput) && !foundWords.has(currentInput)) {
      const newFoundWords = new Set(foundWords).add(currentInput);
      setFoundWords(newFoundWords);

      // Reveal cells for the found word
      const wordIndex = solutionWords.indexOf(currentInput);
      const newRevealed = new Set(revealedCells);
      currentLevel.grid.forEach(cell => {
        if (cell.words.includes(wordIndex)) {
          newRevealed.add(`${cell.x},${cell.y}`);
        }
      });
      setRevealedCells(newRevealed);
      setNotification(t.congrats);

      // Check if all words have been found
      if (newFoundWords.size === solutionWords.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      // Show appropriate error message
      setNotification(foundWords.has(currentInput) ? "Already found!" : t.wrongAnswer);
    }

    // Reset input and used letters
    setCurrentInput("");
    setUsedLetterIndices(new Set());
    setTimeout(() => setNotification(null), 1500);
  }, [currentInput, currentLevel, foundWords, revealedCells, t, nextLevel]);

  /**
   * Reveals a random letter in the grid as a hint
   * Also checks if revealing the letter completes any words
   */
  const onHint = useCallback(() => {
    if (!currentLevel || revealedCells.size >= currentLevel.grid.length) return;

    // Find cells that are not yet revealed
    const unrevealedCells = currentLevel.grid.filter(
      cell => !revealedCells.has(`${cell.x},${cell.y}`)
    );

    if (unrevealedCells.length === 0) return;

    // Select a random unrevealed cell
    const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
    const newRevealed = new Set(revealedCells);
    newRevealed.add(`${randomCell.x},${randomCell.y}`);
    setRevealedCells(newRevealed);

    // Check if revealing this cell completes any words
    const solutionWords = currentLevel.words;
    const newlyFoundWords: string[] = [];

    // For each word in the solution, check if all its cells are now revealed
    solutionWords.forEach((word, wordIndex) => {
      if (foundWords.has(word)) return; // Skip if already found

      // Check if all cells for this word are revealed
      const allCellsRevealed = currentLevel.grid
        .filter(cell => cell.words.includes(wordIndex))
        .every(cell => newRevealed.has(`${cell.x},${cell.y}`));

      if (allCellsRevealed) {
        newlyFoundWords.push(word);
      }
    });

    // If we found new words, update the foundWords set
    if (newlyFoundWords.length > 0) {
      const newFoundWords = new Set(foundWords);
      newlyFoundWords.forEach(word => newFoundWords.add(word));
      setFoundWords(newFoundWords);

      // Show a more specific notification
      if (newlyFoundWords.length === 1) {
        setNotification(`${t.hintUsed || "Hint used!"} ${t.congrats || "Congratulations!"} Found: ${newlyFoundWords[0]}`);
      } else {
        setNotification(`${t.hintUsed || "Hint used!"} ${t.congrats || "Congratulations!"} Found: ${newlyFoundWords.length} words!`);
      }

      // Check if all words are found
      if (newFoundWords.size === solutionWords.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      // Show regular hint notification
      setNotification(t.hintUsed || "Hint used!");
    }

    setTimeout(() => setNotification(null), 1500);
  }, [currentLevel, foundWords, revealedCells, t, nextLevel]);

  /**
   * Navigates back to the game mode selection screen
   */
  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  // Return game state and handler functions
  return {
    loading,            // Loading state for level data
    currentLevel,       // Current level data
    currentLevelIndex,  // Index of the current level
    letters,            // Available letters for forming words
    currentInput,       // Current word being formed
    revealedCells,      // Set of revealed cell coordinates
    notification,       // Notification message to display
    usedLetterIndices,  // Indices of used letters
    handleBack,         // Function to navigate back
    onLetterSelect,     // Function to handle letter selection
    onRemoveLast,       // Function to remove the last letter
    onShuffle,          // Function to shuffle letters
    onCheckWord,        // Function to validate the current word
    onHint,             // Function to reveal a hint letter
  };
}
