// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * This hook provides the core game logic and state management for the Letter Flow game.
 * It handles user interactions, game state, and game progression.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
// Navigation utilities
import { useNavigate, useParams } from 'react-router-dom';
// Game mode configuration
import { useGameMode } from '@/hooks/useGameMode';
// Internationalization
import { useTranslation } from '@/hooks/useTranslation';
// Game state management
import { useGame } from '@/hooks/useGame';
// Game engine and types
import { letterFlowGameEngineInstance, type letterFlowLevel, type BoardCell, type WordPath } from '../engine';
// Color utility functions
import { colorForString } from '../utils/colors';

/**
 * Custom hook for managing the Letter Flow game state and logic
 * 
 * This hook provides all the functionality needed to play the Letter Flow game,
 * including board state management, path selection, word validation, and game progression.
 * 
 * @returns Various state variables and handler functions for the game
 */
export function useLetterFlowGame() {
  // Navigation utilities
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  
  // Game configuration from the game mode hook
  const { language, categories, difficulty, gameMode, teams, currentTeam, consumeHint } = useGameMode();
  
  // Translation function for internationalization
  const { t } = useTranslation();

  // Game state management from the useGame hook
  const { loading, currentLevel, currentLevelIndex, nextLevel } = useGame<letterFlowLevel>(
    letterFlowGameEngineInstance,
    { language, categories, difficulty }
  );

  // Game state variables
  const [board, setBoard] = useState<BoardCell[]>([]);           // Game board state
  const [selectedPath, setSelectedPath] = useState<BoardCell[]>([]); // Currently selected path
  const [foundWords, setFoundWords] = useState<WordPath[]>([]);   // List of found words
  const [notification, setNotification] = useState<string | null>(null); // Current notification
  const [activeLetter, setActiveLetter] = useState<string | null>(null); // Currently active letter

  /**
   * Effect hook to initialize the game board when the level changes
   * 
   * This effect initializes the game board based on the current level data.
   * If the level already has a board with letters, it uses that.
   * Otherwise, it generates a new board from the level's letters.
   */
  useEffect(() => {
    if (currentLevel) {
      // Check if the level already has a valid board
      if (currentLevel.board && currentLevel.board.length > 0 && currentLevel.board.some(cell => cell.letter)) {
        // Use the existing board
        setBoard(currentLevel.board.map(c => ({ ...c })));
      } else {
        // Generate a new board from the level's letters
        const newBoard = letterFlowGameEngineInstance.generateBoard(
          "",
          currentLevel.difficulty,
          language,
          currentLevel.board.map(cell => cell.letter).join("")
        );
        setBoard(newBoard);
      }
      // Reset game state
      setFoundWords([]);
      setSelectedPath([]);
      setActiveLetter(null);
    }
  }, [currentLevel, language]);

  /**
   * Memoized hook to get all unique letters in the current level
   * 
   * @returns Array of unique letters from all endpoints
   */
  const allLetters = useMemo(() => {
    return [...new Set(currentLevel?.endpoints.map(e => e.letter) || [])];
  }, [currentLevel]);

  /**
   * Get color for a specific letter
   * 
   * @param letter - The letter to get color for
   * @returns CSS color string or undefined
   */
  const colorForLetter = useCallback((letter: string | undefined | null) => {
    if (!letter) return undefined;
    return colorForString(letter);
  }, []);

  /**
   * Check if a board cell is an endpoint
   * 
   * @param cell - The cell to check
   * @returns True if the cell is an endpoint
   */
  const isEndpoint = useCallback((cell: BoardCell) => {
    if (!currentLevel) return false;
    return currentLevel.endpoints.some((endpoint: { x: number; y: number; letter: string }) =>
      endpoint.x === cell.x && endpoint.y === cell.y && endpoint.letter === cell.letter
    );
  }, [currentLevel]);

  /**
   * Check if two cells are adjacent (horizontally or vertically)
   * 
   * @param cell1 - First cell
   * @param cell2 - Second cell
   * @returns True if cells are adjacent
   */
  const areAdjacent = useCallback((cell1: BoardCell, cell2: BoardCell) => {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }, []);

  /**
   * Check if a path is valid (all adjacent cells are connected)
   * 
   * @param path - Path to validate
   * @returns True if the path is valid
   */
  const isValidPath = useCallback((path: BoardCell[]) => {
    if (path.length < 2) return true;
    for (let i = 1; i < path.length; i++) {
      if (!areAdjacent(path[i - 1], path[i])) return false;
    }
    return true;
  }, [areAdjacent]);

  /**
   * Check if a cell is blocked for the currently active letter
   * 
   * @param cell - Cell to check
   * @param start - Starting cell of the path
   * @param activeLetterLocal - Currently active letter
   * @returns True if the cell is blocked
   */
  const isBlockedForActive = useCallback((cell: BoardCell, start: BoardCell | null, activeLetterLocal: string | null) => {
    if (!cell.letter) {
      // Empty cell
      if (cell.isUsed) {
        // Cell is already used
        if (activeLetterLocal) {
          // Check if this cell is part of the current letter's own connection
          const ownConn = foundWords.find(p => p.word === activeLetterLocal);
          if (ownConn && ownConn.cells.some(cc => cc.x === cell.x && cc.y === cell.y)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }

    // Don't allow going back to the start cell
    if (start && cell.x === start.x && cell.y === start.y) return false;

    // Allow reaching the endpoint for the active letter
    if (activeLetterLocal && cell.letter === activeLetterLocal && isEndpoint(cell)) return false;

    return true;
  }, [foundWords, isEndpoint]);

  /**
   * Find connections that overlap with a new path
   * 
   * @param newPath - The new path to check for overlaps
   * @returns Array of overlapping connections
   */
  const findOverlappingConnections = useCallback((newPath: BoardCell[]) => {
    if (foundWords.length === 0) return [];
    return foundWords.filter(path =>
      path.cells.some(pc => newPath.some(nc => nc.x === pc.x && nc.y === pc.y))
    );
  }, [foundWords]);

  /**
   * Start a notification that will automatically disappear after a specified time
   * 
   * @param text - Notification text
   * @param ms - Duration in milliseconds (default: 1200)
   */
  const startNotification = useCallback((text: string, ms = 1200) => {
    setNotification(text);
    if (ms > 0) setTimeout(() => setNotification(null), ms);
  }, []);

  /**
   * Handle mouse down event on a board cell
   * 
   * This function is called when the user clicks on a cell. If it's an endpoint,
   * it either removes an existing connection or starts a new path.
   * 
   * @param cell - The cell that was clicked
   */
  const handleMouseDown = useCallback((cell: BoardCell) => {
    if (!isEndpoint(cell)) return;

    // Check if there's an existing connection for this letter
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      // Remove the existing connection
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        return used ? { ...c, isUsed: false } : c;
      }));
      startNotification(`Removed connection for ${cell.letter}`);
    }

    // Start a new path
    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint, startNotification]);

  /**
   * Handle mouse enter event on a board cell
   * 
   * This function is called when the mouse moves over a cell while drawing a path.
   * It updates the path based on the current cell and validates if the path is complete.
   * 
   * @param cell - The cell the mouse entered
   */
  const handleMouseEnter = useCallback((cell: BoardCell) => {
    if (!activeLetter) return;
    if (selectedPath.length === 0) return;

    const startCell = selectedPath[0] || null;

    if (isBlockedForActive(cell, startCell, activeLetter)) return;

    if (!(cell.letter === activeLetter || cell.letter === '')) return;

    const last = selectedPath[selectedPath.length - 1];
    if (last && last.x === cell.x && last.y === cell.y) return;

    const dx = Math.abs(cell.x - last.x);
    const dy = Math.abs(cell.y - last.y);
    if ((dx === 1 && dy === 1) || dx > 1 || dy > 1) return;

    const earlierIndex = selectedPath.findIndex(c => c.x === cell.x && c.y === cell.y);
    if (earlierIndex !== -1) {
      setSelectedPath(prev => prev.slice(0, earlierIndex + 1));
      return;
    }

    if (cell.isUsed) return;

    const newPath = [...selectedPath, cell];
    if (!isValidPath(newPath)) return;

    const isTargetEndpoint = isEndpoint(cell) &&
      !(selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y) &&
      cell.letter === activeLetter;

    if (isTargetEndpoint) {
      // Check for overlapping connections
      const overlapping = findOverlappingConnections(newPath);

      if (overlapping.length > 0) {
        // Remove overlapping connections
        setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
        setBoard(prev => prev.map(c => {
          const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
          return overlapped ? { ...c, isUsed: false } : c;
        }));
        startNotification('Existing connection(s) removed by new connection');
      }

      // Get the color for this endpoint
      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color
        || colorForLetter(newPath[0].letter);

      // Mark cells as used
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        return used ? { ...c, isUsed: true, color: endpointColor } : c;
      }));

      // Create the new found word
      const newFound: WordPath = {
        word: activeLetter!,
        cells: newPath.map(p => {
          const b = board.find(bc => bc.x === p.x && bc.y === p.y);
          return { ...p, color: (b && b.color) || endpointColor };
        }),
        startIndex: 0
      };

      // Add the new word to found words
      setFoundWords(prev => {
        const filtered = prev.filter(p => p.word !== activeLetter);
        return [...filtered, newFound];
      });

      // Show notification
      startNotification(`Connected ${activeLetter}` , 900);

      // Reset active state
      setActiveLetter(null);
      setSelectedPath([]);

      // Check if all letters are connected
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));

      if (isComplete) {
        // Show congrats message and move to next level
        setTimeout(() => {
          startNotification(t.congrats, 2000);
          setTimeout(() => nextLevel(), 2000);
        }, 800);
      }
    } else {
      // Continue building the path
      setSelectedPath(newPath);
    }
  }, [activeLetter, selectedPath, isBlockedForActive, isEndpoint, isValidPath, findOverlappingConnections, board, colorForLetter, foundWords, allLetters, nextLevel, t, startNotification]);

  /**
   * Handle mouse up event
   * 
   * This function is called when the mouse button is released. It checks if the current
   * path connects two endpoints of the same letter. If not, it shows an error notification.
   */
  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      const isConnectedToEndpoint = isEndpoint(lastCell) &&
        !(selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) &&
        lastCell.letter === activeLetter;

      if (!isConnectedToEndpoint) {
        // Reset selection and show error
        setActiveLetter(null);
        setSelectedPath([]);
        startNotification('Path must connect two endpoints!', 1200);
      }
    }
  }, [selectedPath, isEndpoint, activeLetter, startNotification]);

  /**
   * Provide a hint to the player
   * 
   * This function shows a hint for an unconnected letter. In competitive mode,
   * it consumes a hint point from the current team.
   */
  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= currentLevel.endpoints.length / 2) return;
    
    // Check if in competitive mode and if hints are available
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        startNotification(t.noHintsLeft, 2000);
        return;
      }
    }
    
    // Find letters that haven't been connected yet
    const unconnectedLetters = allLetters.filter(letter => !foundWords.some(path => path.word === letter));
    if (unconnectedLetters.length === 0) return;
    
    // Show hint for the first unconnected letter
    const hintLetter = unconnectedLetters[0] as string;
    startNotification(`Hint: Connect the two "${hintLetter}" letters`, 3000);
  }, [currentLevel, foundWords, gameMode, teams, currentTeam, consumeHint, t, allLetters, startNotification]);

  /**
   * Undo the last action
   * 
   * This function removes the most recently found word connection and
   * updates the board state accordingly.
   */
  const onUndo = useCallback(() => {
    if (foundWords.length === 0) return;
    const lastConnection = foundWords[foundWords.length - 1];
    setFoundWords(prev => prev.slice(0, -1));
    setBoard(prev => prev.map(c => {
      const wasUsed = lastConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
      return wasUsed ? { ...c, isUsed: false } : c;
    }));
    startNotification(`Undo: Removed connection for ${lastConnection.word}`);
  }, [foundWords, startNotification]);

  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => ({ ...c, isUsed: false })));
    setSelectedPath([]);
    setActiveLetter(null);
    startNotification('Game reset');
  }, [startNotification]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  return {
    loading,
    currentLevel,
    currentLevelIndex,
    board,
    selectedPath,
    foundWords,
    notification,
    isChecking: false,
    activeLetter,
    isDrawing: Boolean(activeLetter),
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    clearSelection: () => { setSelectedPath([]); setActiveLetter(null); },
    onHint,
    onUndo,
    onReset,
  };
}