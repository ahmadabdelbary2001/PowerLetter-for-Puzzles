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
  // FIX: Destructure all necessary values from useGameMode for the hint logic
  const { language, categories, difficulty, gameMode, teams, currentTeam, consumeHint } = useGameMode();
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
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]);

  useEffect(() => {
    if (currentLevel) {
      if (formationGameEngine.generateLetters) {
        setLetters(formationGameEngine.generateLetters("", currentLevel.difficulty, language, currentLevel.baseLetters));
      }
      setFoundWords(new Set());
      setCurrentInput("");
      setUsedLetterIndices([]);
      setRevealedCells(new Set());
    }
  }, [currentLevel, language]);

  const onLetterSelect = useCallback((letter: string, index: number) => {
    if (usedLetterIndices.includes(index)) return;
    setCurrentInput(prev => prev + letter);
    setUsedLetterIndices(prev => [...prev, index]);
  }, [usedLetterIndices]);

  const onRemoveLast = useCallback(() => {
    setCurrentInput(prev => prev.slice(0, -1));
    setUsedLetterIndices(prev => prev.slice(0, -1));
  }, []);

  const onShuffle = useCallback(() => {
    setLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  /**
   * FIX: Removed unnecessary dependencies from the useCallback array.
   * The function now only re-creates when `currentInput` or `currentLevel` changes.
   */
  const onCheckWord = useCallback(() => {
    if (!currentLevel || currentInput.length === 0) return;

    const currentFoundWords = new Set(foundWords);
    if (currentLevel.words.includes(currentInput) && !currentFoundWords.has(currentInput)) {
      currentFoundWords.add(currentInput);
      setFoundWords(currentFoundWords);

      const wordIndex = currentLevel.words.indexOf(currentInput);
      const newRevealed = new Set(revealedCells);
      currentLevel.grid.forEach(cell => {
        if (cell.words.includes(wordIndex)) {
          newRevealed.add(`${cell.x},${cell.y}`);
        }
      });
      setRevealedCells(newRevealed);
      setNotification(t.congrats);

      if (currentFoundWords.size === currentLevel.words.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      setNotification(currentFoundWords.has(currentInput) ? t.alreadyFound : t.wrongAnswer);
    }

    setCurrentInput("");
    setUsedLetterIndices([]);
    setTimeout(() => setNotification(null), 1500);
  }, [currentInput, currentLevel, foundWords, revealedCells, t, nextLevel]);


  /**
   * FIX: The onHint function now correctly handles competitive mode by consuming a hint
   * from the active team and displaying a notification if no hints are left.
   */
  const onHint = useCallback(() => {
    if (!currentLevel) return;

    // Handle hint consumption for competitive mode
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification(t.noHintsLeft);
        setTimeout(() => setNotification(null), 2000);
        return; // Stop if no hints are available
      }
    }

    const unrevealedCells = currentLevel.grid.filter(
      cell => !revealedCells.has(`${cell.x},${cell.y}`)
    );

    if (unrevealedCells.length === 0) return;

    const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
    const newRevealed = new Set(revealedCells).add(`${randomCell.x},${randomCell.y}`);
    setRevealedCells(newRevealed);

    // Check if the hint completed any words
    const newlyFoundWords: string[] = [];
    currentLevel.words.forEach((word, wordIndex) => {
      if (foundWords.has(word)) return;
      const allCellsRevealed = currentLevel.grid
        .filter(cell => cell.words.includes(wordIndex))
        .every(cell => newRevealed.has(`${cell.x},${cell.y}`));
      if (allCellsRevealed) {
        newlyFoundWords.push(word);
      }
    });

    if (newlyFoundWords.length > 0) {
      const updatedFoundWords = new Set([...foundWords, ...newlyFoundWords]);
      setFoundWords(updatedFoundWords);
      setNotification(`${t.congrats} ${t.found} ${newlyFoundWords.join(', ')}`);

      if (updatedFoundWords.size === currentLevel.words.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      setNotification(t.hintUsed);
    }

    setTimeout(() => setNotification(null), 1500);
  }, [currentLevel, revealedCells, foundWords, gameMode, teams, currentTeam, consumeHint, t, nextLevel]);

  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${params.gameType}`);
    } else {
      navigate(`/game-mode/${params.gameType}`);
    }
  }, [navigate, params.gameType, gameMode]);

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
