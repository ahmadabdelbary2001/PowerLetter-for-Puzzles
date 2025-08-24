// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * @description Custom hook to manage the state and logic for the Letter Flow game.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { letterFlowGameEngineInstance, type letterFlowLevel, type BoardCell, type WordPath } from '../engine';

export function useLetterFlowGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty, gameMode, teams, currentTeam, consumeHint } = useGameMode();
  const { t } = useTranslation();

  const { loading, currentLevel, currentLevelIndex, nextLevel } = useGame<letterFlowLevel>(
    letterFlowGameEngineInstance,
    { language, categories, difficulty }
  );

  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selectedPath, setSelectedPath] = useState<BoardCell[]>([]);
  const [foundWords, setFoundWords] = useState<WordPath[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  useEffect(() => {
    if (currentLevel) {
      // Use the board from currentLevel directly if it exists and has letters
      if (currentLevel.board && currentLevel.board.length > 0 && currentLevel.board.some(cell => cell.letter)) {
        setBoard(currentLevel.board);
      } else {
        // Otherwise generate a new board for the level
        const newBoard = letterFlowGameEngineInstance.generateBoard(
          "",
          currentLevel.difficulty,
          language,
          currentLevel.board.map(cell => cell.letter).join("")
        );
        setBoard(newBoard);
      }
      setFoundWords([]);
      setSelectedPath([]);
      setActiveLetter(null);
    }
  }, [currentLevel, language]);

  // Get endpoints for a specific letter
  const getEndpointsForLetter = useCallback((letter: string) => {
    if (!currentLevel) return [];
    return currentLevel.endpoints.filter((endpoint: { letter: string }) => endpoint.letter === letter);
  }, [currentLevel]);

  // Check if a cell is an endpoint
  const isEndpoint = useCallback((cell: BoardCell) => {
    if (!currentLevel) return false;
    return currentLevel.endpoints.some((endpoint: { x: number; y: number; letter: string }) =>
      endpoint.x === cell.x && endpoint.y === cell.y && endpoint.letter === cell.letter
    );
  }, [currentLevel]);

  // Check if two cells are adjacent (horizontally or vertically)
  const areAdjacent = useCallback((cell1: BoardCell, cell2: BoardCell) => {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }, []);

  // Check if a path is valid (only horizontal or vertical moves)
  const isValidPath = useCallback((path: BoardCell[]) => {
    if (path.length < 2) return true;

    for (let i = 1; i < path.length; i++) {
      if (!areAdjacent(path[i - 1], path[i])) {
        return false;
      }
    }
    return true;
  }, [areAdjacent]);

  // Check if a path crosses any existing paths
  const doesPathCrossExisting = useCallback((newPath: BoardCell[]) => {
    if (foundWords.length === 0) return false;

    // Get all cells from existing paths
    const existingCells = foundWords.flatMap(path => path.cells);

    // Check if any cell in the new path (except endpoints) intersects with existing paths
    for (let i = 1; i < newPath.length - 1; i++) {
      const cell = newPath[i];
      if (existingCells.some(existing => existing.x === cell.x && existing.y === cell.y)) {
        return true;
      }
    }

    return false;
  }, [foundWords]);

  // Check if a cell is already used in a found path
  const isCellUsed = useCallback((cell: BoardCell) => {
    // Allow using cells that are part of the current path
    if (selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y) {
      return false;
    }
    return foundWords.some(path => path.cells.some(c => c.x === cell.x && c.y === cell.y));
  }, [foundWords, selectedPath]);

  const handleMouseDown = useCallback((cell: BoardCell) => {
    // If it's an endpoint, start a path
    if (isEndpoint(cell)) {
      // Check if this letter is already connected
      const existingConnection = foundWords.find(path => path.word === cell.letter);

      if (existingConnection) {
        // Remove existing connection
        setFoundWords(prev => prev.filter(path => path.word !== cell.letter));

        // Mark the cells as unused
        setBoard(prev => prev.map(c => {
          const wasUsed = existingConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
          return wasUsed ? { ...c, isUsed: false } : c;
        }));

        setNotification(`Removed connection for ${cell.letter}`);
        setTimeout(() => setNotification(null), 1500);
      }

      // Start a new path
      setActiveLetter(cell.letter);
      setSelectedPath([cell]);
    }
  }, [isEndpoint, foundWords]);

  const handleMouseEnter = useCallback((cell: BoardCell) => {
    if (!activeLetter) return;

    // Don't allow going through cells that are already used
    if (isCellUsed(cell)) {
      return;
    }

    // Only allow connecting to cells with the same letter
    if (cell.letter === activeLetter || cell.letter === '') {
      // Check if we're trying to connect to another endpoint of the same letter
      const isTargetEndpoint = isEndpoint(cell) &&
        !(selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y);

      // If we're connecting to an endpoint, finalize the path
      if (isTargetEndpoint) {
        // Create a new path that includes all cells
        const newPath = [...selectedPath, cell];

        // Check if the path is valid (only horizontal or vertical moves)
        if (!isValidPath(newPath)) {
          setNotification("Connections must be horizontal or vertical!");
          setTimeout(() => setNotification(null), 1500);
          return;
        }

        // Check if the path crosses any existing paths
        if (doesPathCrossExisting(newPath)) {
          setNotification("Connections cannot cross each other!");
          setTimeout(() => setNotification(null), 1500);
          return;
        }

        // Check if this letter is already connected
        const existingConnection = foundWords.find(path => path.word === activeLetter);

        if (existingConnection) {
          // Remove existing connection
          setFoundWords(prev => prev.filter(path => path.word !== activeLetter));

          // Mark the cells as unused
          setBoard(prev => prev.map(c => {
            const wasUsed = existingConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
            return wasUsed ? { ...c, isUsed: false } : c;
          }));

          setNotification(`Removed connection for ${activeLetter}`);
          setTimeout(() => setNotification(null), 1500);
        }

        // Add the new connection
        setSelectedPath(newPath);

        // Add to found words
        const newFoundWord: WordPath = {
          word: activeLetter,
          cells: newPath,
          startIndex: 0,
        };

        setFoundWords(prev => [...prev, newFoundWord]);
        setNotification(`Great! Connected ${activeLetter} to ${activeLetter}`);

        // Mark the cells as used
        setBoard(prev => prev.map(c =>
          newPath.some(selected => selected.x === c.x && selected.y === c.y)
            ? { ...c, isUsed: true }
            : c
        ));

        // Check if all letter pairs have been connected
        const allLetters = [...new Set(currentLevel?.endpoints.map((e: { letter: string }) => e.letter) || [])];
        const isComplete = allLetters.every(letter =>
          foundWords.some(path => path.word === letter) || activeLetter === letter
        );

        if (isComplete) {
          setTimeout(() => {
            setNotification(t.congrats);
            setTimeout(() => nextLevel(), 2000);
          }, 1500);
        }

        setActiveLetter(null);
        setSelectedPath([]);
      } else {
        // Create a new path with the added cell
        const newPath = [...selectedPath, cell];

        // Check if the path is valid (only horizontal or vertical moves)
        if (!isValidPath(newPath)) {
          setNotification("Connections must be horizontal or vertical!");
          setTimeout(() => setNotification(null), 1500);
          return;
        }

        // Check if the path crosses any existing paths
        if (doesPathCrossExisting(newPath)) {
          setNotification("Connections cannot cross each other!");
          setTimeout(() => setNotification(null), 1500);
          return;
        }

        // Add the cell to the current path
        setSelectedPath(newPath);
      }
    }
  }, [activeLetter, selectedPath, isEndpoint, isCellUsed, foundWords, t, nextLevel, currentLevel, isValidPath, doesPathCrossExisting]);

  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 1) {
      // Check if we connected to an endpoint
      const lastCell = selectedPath[selectedPath.length - 1];
      const isConnectedToEndpoint = isEndpoint(lastCell) &&
        !(selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y);

      if (!isConnectedToEndpoint) {
        // If we're not connecting to an endpoint, cancel the path
        setActiveLetter(null);
        setSelectedPath([]);
        setNotification("Path must connect two endpoints!");
        setTimeout(() => setNotification(null), 1500);
      }
    }
  }, [selectedPath, isEndpoint]);


  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= currentLevel.endpoints.length / 2) return;

    // Handle hint consumption for competitive mode
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification(t.noHintsLeft);
        setTimeout(() => setNotification(null), 2000);
        return; // Stop if no hints are available
      }
    }

    // Find the first unconnected letter pair
    const allLetters = [...new Set(currentLevel.endpoints.map((e: { letter: string }) => e.letter))];
    const unconnectedLetters = allLetters.filter(letter =>
      !foundWords.some(path => path.word === letter)
    );

    if (unconnectedLetters.length === 0) return;

    const hintLetter = unconnectedLetters[0] as string;
    const endpoints = getEndpointsForLetter(hintLetter);

    if (endpoints.length >= 2) {
      setNotification(`Hint: Connect the two "${hintLetter}" letters`);
      setTimeout(() => setNotification(null), 3000);
    }
  }, [currentLevel, foundWords, gameMode, teams, currentTeam, consumeHint, t, getEndpointsForLetter]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  return {
    loading,
    currentLevel,
    currentLevelIndex,
    board,
    selectedPath,
    foundWords,
    notification,
    isChecking: false, // This was removed but UI might still expect it
    activeLetter,
    isDrawing: false, // This was removed but UI might still expect it
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    clearSelection: () => {}, // This was removed but UI might still expect it
    onHint,
  };
}