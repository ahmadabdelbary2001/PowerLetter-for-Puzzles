// src/features/formation-game/hooks/useFormationGame.ts
/**
 * @description Final "assembler" hook for the Word Formation game.
 * It assembles all logic and content needed by the UI.
 */
import { useState, useEffect, useCallback } from 'react';
import { useGameController } from '@/hooks/game/useGameController';
import { formationGameEngine, type FormationLevel } from '../engine';

export function useFormationGame() {
  const controller = useGameController<FormationLevel>({
    engine: formationGameEngine,
    gameId: 'formation',
  });

  const { currentLevel, gameModeState, t, nextLevel } = controller;
  const { gameMode, teams, currentTeam, consumeHint } = gameModeState;

  const [letters, setLetters] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]);

  useEffect(() => {
    if (currentLevel) {
      if (formationGameEngine.generateLetters) {
        // --- The call now correctly passes only one argument. ---
        setLetters(formationGameEngine.generateLetters(currentLevel.baseLetters));
      }
      setFoundWords(new Set());
      setCurrentInput("");
      setUsedLetterIndices([]);
      setRevealedCells(new Set());
    }
  }, [currentLevel]);

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

  const onCheckWord = useCallback(() => {
    if (!currentLevel || currentInput.length === 0) return;
    const currentFoundWords = new Set(foundWords);
    if (currentLevel.words.includes(currentInput) && !currentFoundWords.has(currentInput)) {
      currentFoundWords.add(currentInput);
      setFoundWords(currentFoundWords);
      const wordIndex = currentLevel.words.indexOf(currentInput);
      const newRevealed = new Set(revealedCells);
      currentLevel.grid.forEach(cell => {
        if (cell.words.includes(wordIndex)) newRevealed.add(`${cell.x},${cell.y}`);
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

  const onHint = useCallback(() => {
    if (!currentLevel) return;
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification(t.noHintsLeft);
        setTimeout(() => setNotification(null), 2000);
        return;
      }
    }
    const unrevealedCells = currentLevel.grid.filter(cell => !revealedCells.has(`${cell.x},${cell.y}`));
    if (unrevealedCells.length === 0) return;
    const randomCell = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
    const newRevealed = new Set(revealedCells).add(`${randomCell.x},${randomCell.y}`);
    setRevealedCells(newRevealed);
    const newlyFoundWords: string[] = [];
    currentLevel.words.forEach((word, wordIndex) => {
      if (foundWords.has(word)) return;
      const allCellsRevealed = currentLevel.grid.filter(cell => cell.words.includes(wordIndex)).every(cell => newRevealed.has(`${cell.x},${cell.y}`));
      if (allCellsRevealed) newlyFoundWords.push(word);
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

  return {
    ...controller,
    letters,
    currentInput,
    revealedCells,
    notification,
    usedLetterIndices,
    onLetterSelect,
    onRemoveLast,
    onShuffle,
    onCheckWord,
    onHint,
  };
}
