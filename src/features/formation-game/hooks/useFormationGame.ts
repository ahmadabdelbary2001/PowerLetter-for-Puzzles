// src/features/formation-game/hooks/useFormationGame.ts
/**
 * @description Final "assembler" hook for the Word Formation game.
 * --- It now uses the centralized notification system correctly. ---
 */
import { useState, useEffect, useCallback } from 'react';
import { useGameController } from '@/hooks/game/useGameController';
import { formationGameEngine, type FormationLevel } from '../engine';

export function useFormationGame() {
  const controller = useGameController<FormationLevel>({
    engine: formationGameEngine,
    gameId: 'formation',
  });

  const { currentLevel, gameModeState, nextLevel, setNotification } = controller;
  const { gameMode, teams, currentTeam, consumeHint } = gameModeState;

  const [letters, setLetters] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [revealedCells, setRevealedCells] = useState<Set<string>>(new Set());
  const [usedLetterIndices, setUsedLetterIndices] = useState<number[]>([]);

  useEffect(() => {
    if (currentLevel) {
      if (formationGameEngine.generateLetters) {
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
      setNotification({ messageKey: 'wordFound', type: 'success' });
      if (currentFoundWords.size === currentLevel.words.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      const messageKey = currentFoundWords.has(currentInput) ? 'alreadyFound' : 'wordNotFound';
      setNotification({ messageKey, type: 'error' });
    }
    setCurrentInput("");
    setUsedLetterIndices([]);
  }, [currentInput, currentLevel, foundWords, revealedCells, setNotification, nextLevel]);

  const onHint = useCallback(() => {
    if (!currentLevel) return;
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification({ messageKey: 'noMoreHints', type: 'error' });
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
      setNotification({ messageKey: 'wordFound', type: 'success' });
      if (updatedFoundWords.size === currentLevel.words.length) {
        setTimeout(() => nextLevel(), 2000);
      }
    } else {
      setNotification({ messageKey: 'hintUsed', type: 'info' });
    }
  }, [currentLevel, revealedCells, foundWords, gameMode, teams, currentTeam, consumeHint, nextLevel, setNotification]);

  return {
    ...controller,
    letters,
    currentInput,
    revealedCells,
    usedLetterIndices,
    onLetterSelect,
    onRemoveLast,
    onShuffle,
    onCheckWord,
    onHint,
  };
}
