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

// Move COLORS to module scope so it's stable and doesn't need to be in callback deps
const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A1',
  '#A133FF', '#33FFF0', '#FFD733', '#33FF96', '#FF9633'
];

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
      if (currentLevel.board && currentLevel.board.length > 0 && currentLevel.board.some(cell => cell.letter)) {
        setBoard(currentLevel.board.map(c => ({ ...c })));
      } else {
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

  const colorForLetter = useCallback((letter: string | undefined | null) => {
    if (!letter) return undefined;
    const code = letter.toUpperCase().charCodeAt(0) || 0;
    const idx = (code - 65) % COLORS.length;
    return COLORS[(idx + COLORS.length) % COLORS.length];
  }, []);

  const isEndpoint = useCallback((cell: BoardCell) => {
    if (!currentLevel) return false;
    return currentLevel.endpoints.some((endpoint: { x: number; y: number; letter: string }) =>
      endpoint.x === cell.x && endpoint.y === cell.y && endpoint.letter === cell.letter
    );
  }, [currentLevel]);

  const areAdjacent = useCallback((cell1: BoardCell, cell2: BoardCell) => {
    const dx = Math.abs(cell1.x - cell2.x);
    const dy = Math.abs(cell1.y - cell2.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }, []);

  const isValidPath = useCallback((path: BoardCell[]) => {
    if (path.length < 2) return true;
    for (let i = 1; i < path.length; i++) {
      if (!areAdjacent(path[i - 1], path[i])) return false;
    }
    return true;
  }, [areAdjacent]);

  // NEW: treat cells with letters as blocks for other letters, and treat 'isUsed' cells as blocked
  // unless editing/removing the existing connection for the same letter (we allow toggling by starting on an endpoint)
  const isBlockedForActive = useCallback((cell: BoardCell, start: BoardCell | null, activeLetterLocal: string | null) => {
    // empty cells are not letter-blocks
    if (!cell.letter) {
      // but if the cell is already used by a found connection, it is blocked for traversal
      if (cell.isUsed) {
        // allow traversal if user is editing the exact same connection that owns this cell:
        // find the connection for activeLetterLocal (if any) and allow its own cells to be traversed while editing
        if (activeLetterLocal) {
          const ownConn = foundWords.find(p => p.word === activeLetterLocal);
          if (ownConn && ownConn.cells.some(cc => cc.x === cell.x && cc.y === cell.y)) {
            // allow editing your own connection's cells (so you can re-route it)
            return false;
          }
        }
        return true;
      }
      return false;
    }

    // If cell has a letter:
    // allow if it's the starting endpoint (so you can begin there)
    if (start && cell.x === start.x && cell.y === start.y) return false;

    // allow if it's the endpoint with the same active letter (target)
    if (activeLetterLocal && cell.letter === activeLetterLocal && isEndpoint(cell)) return false;

    // otherwise lettered cells are blocks
    return true;
  }, [foundWords, isEndpoint]);

  const findOverlappingConnections = useCallback((newPath: BoardCell[]) => {
    if (foundWords.length === 0) return [];
    return foundWords.filter(path =>
      path.cells.some(pc => newPath.some(nc => nc.x === pc.x && nc.y === pc.y))
    );
  }, [foundWords]);

  const handleMouseDown = useCallback((cell: BoardCell) => {
    // only start on an endpoint
    if (!isEndpoint(cell)) return;

    // If clicked on an existing connection's letter endpoint -> remove that connection (toggle)
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      // remove connection and free its cells
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        return used ? { ...c, isUsed: false } : c;
      }));
      setNotification(`Removed connection for ${cell.letter}`);
      setTimeout(() => setNotification(null), 1200);
      // allow starting a new path immediately after removal
    }

    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint]);

  const handleMouseEnter = useCallback((cell: BoardCell) => {
    if (!activeLetter) return;
    if (selectedPath.length === 0) return;

    const startCell = selectedPath[0] || null;

    // Block letter blocks and used cells (unless special-case allowed inside isBlockedForActive)
    if (isBlockedForActive(cell, startCell, activeLetter)) return;

    // Only allow same-letter endpoints or empty cells while dragging
    if (!(cell.letter === activeLetter || cell.letter === '')) return;

    // Avoid duplicate stepping onto same cell
    const last = selectedPath[selectedPath.length - 1];
    if (last && last.x === cell.x && last.y === cell.y) return;

    // Prevent diagonal movement (only allow adjacent XY)
    const dx = Math.abs(cell.x - last.x);
    const dy = Math.abs(cell.y - last.y);
    if ((dx === 1 && dy === 1) || dx > 1 || dy > 1) return;

    // Backtracking: if the user moves to any previous cell in the selectedPath,
    // trim the path to that index (allow full backtracking)
    const earlierIndex = selectedPath.findIndex(c => c.x === cell.x && c.y === cell.y);
    if (earlierIndex !== -1) {
      // trim path to this index (inclusive)
      setSelectedPath(prev => prev.slice(0, earlierIndex + 1));
      return;
    }

    // If the cell is already part of the selected path (should be handled above) or is used by another connection, block
    if (cell.isUsed) return;

    // Build new path
    const newPath = [...selectedPath, cell];

    // Validate adjacency for whole path (safety)
    if (!isValidPath(newPath)) return;

    // check if this is a target endpoint (matching letter, endpoint, and not the starting one)
    const isTargetEndpoint = isEndpoint(cell) &&
      !(selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y) &&
      cell.letter === activeLetter;

    if (isTargetEndpoint) {
      // finalizing connection
      // find overlapping connections (they will be removed to make room)
      const overlapping = findOverlappingConnections(newPath);

      if (overlapping.length > 0) {
        setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
        setBoard(prev => prev.map(c => {
          const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
          return overlapped ? { ...c, isUsed: false } : c;
        }));
        setNotification('Existing connection(s) removed by new connection');
        setTimeout(() => setNotification(null), 1200);
      }

      // assign color: prefer endpoint color on board, fallback to deterministic letter color
      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color
        || colorForLetter(newPath[0].letter);

      // mark used cells on board (and attach color)
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        return used ? { ...c, isUsed: true, color: endpointColor } : c;
      }));

      // add found word with color included on each cell
      const newFound: WordPath = {
        word: activeLetter,
        cells: newPath.map(p => {
          const b = board.find(bc => bc.x === p.x && bc.y === p.y);
          return { ...p, color: (b && b.color) || endpointColor };
        }),
        startIndex: 0
      };

      setFoundWords(prev => {
        // replace any existing connection for same letter
        const filtered = prev.filter(p => p.word !== activeLetter);
        return [...filtered, newFound];
      });

      setNotification(`Connected ${activeLetter}`);
      setTimeout(() => setNotification(null), 900);

      setActiveLetter(null);
      setSelectedPath([]);

      // check completion
      const allLetters = [...new Set(currentLevel?.endpoints.map(e => e.letter) || [])];
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));

      if (isComplete) {
        setTimeout(() => {
          setNotification(t.congrats);
          setTimeout(() => nextLevel(), 2000);
        }, 800);
      }
    } else {
      // keep drawing
      setSelectedPath(newPath);
    }
  }, [
    activeLetter,
    selectedPath,
    isBlockedForActive,
    isEndpoint,
    isValidPath,
    findOverlappingConnections,
    board,
    colorForLetter,
    foundWords,
    currentLevel,
    nextLevel,
    t
  ]);

  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      const isConnectedToEndpoint = isEndpoint(lastCell) &&
        !(selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) &&
        lastCell.letter === activeLetter;

      if (!isConnectedToEndpoint) {
        setActiveLetter(null);
        setSelectedPath([]);
        setNotification('Path must connect two endpoints!');
        setTimeout(() => setNotification(null), 1200);
      }
    }
  }, [selectedPath, isEndpoint, activeLetter]);

  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= currentLevel.endpoints.length / 2) return;
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        setNotification(t.noHintsLeft);
        setTimeout(() => setNotification(null), 2000);
        return;
      }
    }
    const allLetters = [...new Set(currentLevel.endpoints.map((e: { letter: string }) => e.letter))];
    const unconnectedLetters = allLetters.filter(letter => !foundWords.some(path => path.word === letter));
    if (unconnectedLetters.length === 0) return;
    const hintLetter = unconnectedLetters[0] as string;
    setNotification(`Hint: Connect the two "${hintLetter}" letters`);
    setTimeout(() => setNotification(null), 3000);
  }, [currentLevel, foundWords, gameMode, teams, currentTeam, consumeHint, t]);

  const onUndo = useCallback(() => {
    if (foundWords.length === 0) return;
    const lastConnection = foundWords[foundWords.length - 1];
    setFoundWords(prev => prev.slice(0, -1));
    setBoard(prev => prev.map(c => {
      const wasUsed = lastConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
      return wasUsed ? { ...c, isUsed: false } : c;
    }));
    setNotification(`Undo: Removed connection for ${lastConnection.word}`);
    setTimeout(() => setNotification(null), 1200);
  }, [foundWords]);

  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => ({ ...c, isUsed: false })));
    setSelectedPath([]);
    setActiveLetter(null);
    setNotification('Game reset');
    setTimeout(() => setNotification(null), 1200);
  }, []);

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
