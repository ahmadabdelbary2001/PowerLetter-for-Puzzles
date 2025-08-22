// src/features/formation-game/hooks/useFormationGame.ts
/**
 * @description Custom hook to manage the state and logic for the Word Formation game.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { formationGameEngine, type FormationLevel } from '../engine';

export function useFormationGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty } = useGameMode();
  const { t } = useTranslation();

  const { loading, currentLevel, currentLevelIndex, nextLevel } = useGame<FormationLevel>(
    formationGameEngine,
    { language, categories, difficulty }
  );

  const [letters, setLetters] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [usedLetterIndices, setUsedLetterIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (currentLevel) {
      if (formationGameEngine.generateLetters) {
        setLetters(formationGameEngine.generateLetters("", currentLevel.difficulty, language, currentLevel.baseLetters));
      }
      setFoundWords(new Set());
      setCurrentInput("");
      setRevealedCells(new Set());
      setUsedLetterIndices(new Set());
    }
  }, [currentLevel, language]);

  const onLetterSelect = useCallback((letter: string, index?: number) => {
    setCurrentInput(prev => prev + letter);
    if (index !== undefined) {
      setUsedLetterIndices(prev => new Set(prev).add(index));
    }
  }, []);

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

  const onShuffle = useCallback(() => {
    setLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const onCheckWord = useCallback(() => {
    if (!currentLevel || currentInput.length === 0) return;

    const solutionWords = currentLevel.words;

    if (solutionWords.includes(currentInput) && !foundWords.has(currentInput)) {
      const newFoundWords = new Set(foundWords).add(currentInput);
      setFoundWords(newFoundWords);

      const wordIndex = solutionWords.indexOf(currentInput);
      const newRevealed = new Set(revealedCells);
      currentLevel.grid.forEach(cell => {
        if (cell.words.includes(wordIndex)) {
          newRevealed.add(`${cell.x},${cell.y}`);
        }
      });
      setRevealedCells(newRevealed);
      setNotification(t.congrats);

      if (newFoundWords.size === solutionWords.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      setNotification(foundWords.has(currentInput) ? "Already found!" : t.wrongAnswer);
    }

    setCurrentInput("");
    setUsedLetterIndices(new Set());
    setTimeout(() => setNotification(null), 1500);
  }, [currentInput, currentLevel, foundWords, revealedCells, t, nextLevel]);

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

    // Show notification
    setNotification(t.hintUsed || "Hint used!");
    setTimeout(() => setNotification(null), 1500);
  }, [currentLevel, revealedCells, t]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  return {
    loading,
    currentLevel,
    currentLevelIndex,
    letters,
    currentInput,
    revealedCells,
    notification,
    usedLetterIndices,
    handleBack,
    onLetterSelect,
    onRemoveLast,
    onShuffle,
    onCheckWord,
    onHint,
  };
}
