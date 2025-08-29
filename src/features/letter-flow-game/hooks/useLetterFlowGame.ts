// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * useLetterFlowGame - manages Letter Flow game state and connection logic.
 *
 * Guarantees implemented:
 * 1) Clicking any endpoint cancels its existing connection (either side of the pair).
 * 2) Finalizing a new connection cancels any overlapping existing connection(s).
 * 3) Hint now finds a valid path between a letter's endpoints and finalizes it (removing overlaps).
 *
 * Other rules:
 * - Only horizontal/vertical adjacency allowed (no diagonals).
 * - Lettered cells (endpoints) are blocks (cannot be passed through) except start or the matching target endpoint.
 * - Empty cells are traversable; isUsed is allowed for hint (we will cancel overlapping connections on finalize).
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { useGame } from '@/hooks/useGame';
import { letterFlowGameEngineInstance, type letterFlowLevel, type BoardCell, type WordPath } from '../engine';
import { colorForString } from '../utils/colors';

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

  // new: gameState for UI (playing | won | failed)
  const [gameState, setGameState] = useState<'playing' | 'won' | 'failed'>('playing');

  // Initialize board when level changes
  useEffect(() => {
    if (!currentLevel) return;

    if (currentLevel.board && currentLevel.board.length > 0 && currentLevel.board.some(c => c.letter)) {
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
    setGameState('playing'); // reset UI state on level change
  }, [currentLevel, language]);

  // All distinct letters in the level
  const allLetters = useMemo(() => [...new Set(currentLevel?.endpoints.map(e => e.letter) || [])], [currentLevel]);

  // Map endpoint coords -> endpoint color (to restore endpoint colors when removing paths)
  const endpointColorMap = useMemo(() => {
    const m = new Map<string, string | undefined>();
    currentLevel?.endpoints.forEach(e => m.set(`${e.x}-${e.y}`, e.color));
    return m;
  }, [currentLevel]);

  const colorForLetter = useCallback((letter: string | undefined | null) => {
    if (!letter) return undefined;
    return colorForString(letter);
  }, []);

  const isEndpoint = useCallback((cell: BoardCell) => {
    if (!currentLevel) return false;
    return currentLevel.endpoints.some(ep => ep.x === cell.x && ep.y === cell.y && ep.letter === cell.letter);
  }, [currentLevel]);

  const areAdjacent = useCallback((a: BoardCell, b: BoardCell) => {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
  }, []);

  const isValidPath = useCallback((path: BoardCell[]) => {
    if (path.length < 2) return true;
    for (let i = 1; i < path.length; i++) {
      if (!areAdjacent(path[i - 1], path[i])) return false;
    }
    return true;
  }, [areAdjacent]);

  /**
   * Blocking logic:
   * - Empty cells: traversable unless isUsed === true (then blocked), except when the used cell belongs to the active letter's own connection (allowed to edit).
   * - Letter-bearing cells (endpoints): blocked except the start cell (so you can start there) or the matching target endpoint (so you can finish).
   */
  const isBlockedForActive = useCallback((cell: BoardCell, start: BoardCell | null, activeLetterLocal: string | null) => {
    if (!cell.letter) {
      if (cell.isUsed) {
        if (activeLetterLocal) {
          const ownConn = foundWords.find(p => p.word === activeLetterLocal);
          if (ownConn && ownConn.cells.some(cc => cc.x === cell.x && cc.y === cell.y)) {
            // allow editing own connection (re-route)
            return false;
          }
        }
        return true;
      }
      return false;
    }

    // If cell has a letter:
    // allow starting cell so user can click the endpoint to start
    if (start && cell.x === start.x && cell.y === start.y) return false;

    // allow target endpoint with same letter
    if (activeLetterLocal && cell.letter === activeLetterLocal && isEndpoint(cell)) return false;

    // otherwise lettered cells are blocks
    return true;
  }, [foundWords, isEndpoint]);

  const findOverlappingConnections = useCallback((newPath: BoardCell[]) => {
    if (foundWords.length === 0) return [] as WordPath[];
    return foundWords.filter(path =>
      path.cells.some(pc => newPath.some(nc => nc.x === pc.x && nc.y === pc.y))
    );
  }, [foundWords]);

  const startNotification = useCallback((text: string, ms = 1200) => {
    setNotification(text);
    if (ms > 0) setTimeout(() => setNotification(null), ms);
  }, []);

  /**
   * handleMouseDown
   * - Clicking an endpoint cancels its existing connection (if any), and then starts a new path from that endpoint.
   */
  const handleMouseDown = useCallback((cell: BoardCell) => {
    if (!isEndpoint(cell)) return;

    // If there's an existing connection for this letter, remove it (cancel)
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        // if endpoint, preserve endpoint color; otherwise clear color
        return used ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
      }));
      startNotification(`Removed connection for ${cell.letter}`, 900);
    }

    // Start a new path
    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint, startNotification, endpointColorMap]);

  /**
   * handleMouseEnter - invoked while user drags (or pointerEnter while dragging)
   * - enforces adjacency, backtracking, blocking rules
   * - finalizes connection when reaching target endpoint of same letter
   * - if new connection overlaps existing connections, those old connections are canceled/removed
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
          const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
          return overlapped ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
        }));
        startNotification('Existing connection(s) removed by new connection', 1100);
      }

      // Get the color for this endpoint
      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color
        || colorForLetter(newPath[0].letter);

      // Mark cells as used (apply color) but keep endpoint color for endpoint cells
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        if (used) {
          return { ...c, isUsed: true, color: epColor ?? endpointColor };
        }
        return c;
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

      // Show notification and finalize outcome
      startNotification(`Connected ${activeLetter}`, 900);

      // Reset active state
      setActiveLetter(null);
      setSelectedPath([]);

      // Check if all letters are connected
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));

      if (isComplete) {
        // In competitive mode keep auto-advance; in single-player switch to 'won' so UI shows Next button
        startNotification(t.congrats, 2000);
        if (gameMode === 'competitive') {
          setTimeout(() => nextLevel(), 2000);
        } else {
          setGameState('won');
        }
      }
    } else {
      // Continue building the path
      setSelectedPath(newPath);
    }
  }, [activeLetter, selectedPath, isBlockedForActive, isEndpoint, isValidPath, findOverlappingConnections, board, colorForLetter, foundWords, allLetters, nextLevel, t, startNotification, endpointColorMap, gameMode]);

  /**
   * handleMouseUp - if the path was not properly connected to a target endpoint, cancel it and notify the player.
   */
  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      const isConnectedToEndpoint = isEndpoint(lastCell) &&
        !(selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) &&
        lastCell.letter === activeLetter;

      if (!isConnectedToEndpoint) {
        setActiveLetter(null);
        setSelectedPath([]);
        startNotification('Path must connect two endpoints!', 1200);
      }
    }
  }, [selectedPath, isEndpoint, activeLetter, startNotification]);

  /**
   * onHint - Find a shortest valid path between an unconnected letter's endpoints and finalize it.
   *
   * Behavior:
   * - Consumes hint in competitive mode (same as before).
   * - Finds first unconnected letter, then runs BFS (4-way) from one endpoint to the other.
   * - BFS treats any cell that has a different letter (i.e., a letter block) as blocked.
   * - BFS allows stepping through empty cells regardless of isUsed (we will remove overlaps when finalizing).
   * - If a path is found, it finalizes exactly like a manual connection (removes overlapping connections, sets isUsed/color, adds to foundWords).
   */
  const onHint = useCallback(() => {
    if (!currentLevel) return;

    // if all already connected, nothing to do
    if (foundWords.length >= (currentLevel.endpoints.length / 2)) return;

    // competitive mode: consume hint
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        startNotification(t.noHintsLeft, 2000);
        return;
      }
    }

    // find unconnected letters
    const unconnectedLetters = allLetters.filter(letter => !foundWords.some(path => path.word === letter));
    if (unconnectedLetters.length === 0) return;

    const hintLetter = unconnectedLetters[0] as string;
    // get endpoints coordinates for this letter from current level
    const endpoints = currentLevel.endpoints.filter(e => e.letter === hintLetter);
    if (endpoints.length < 2) {
      startNotification(`No endpoints found for ${hintLetter}`, 1500);
      return;
    }

    // We'll choose the first two endpoints
    const startEP = endpoints[0];
    const targetEP = endpoints[1];

    // BFS setup on grid
    // Build quick lookup of cells by coord
    const cellMap = new Map<string, BoardCell>();
    board.forEach(c => cellMap.set(`${c.x}-${c.y}`, c));

    // compute bounds (min/max) to limit neighbors
    const xs = board.map(c => c.x); const ys = board.map(c => c.y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);

    const startKey = `${startEP.x}-${startEP.y}`;
    const targetKey = `${targetEP.x}-${targetEP.y}`;

    // BFS queue
    const queue: string[] = [startKey];
    const visited = new Set<string>([startKey]);
    const parent = new Map<string, string | null>();
    parent.set(startKey, null);

    // Helper to check if coordinate is passable for hint:
    // Block if cell has a different letter (i.e., letter block). Allow empty, allow target letter.
    const isPassableForHint = (nx: number, ny: number) => {
      const key = `${nx}-${ny}`;
      const c = cellMap.get(key);
      if (!c) return false;
      if (!c.letter) return true; // empty cell
      if (c.letter === hintLetter) return true; // endpoint of same letter allowed (start/target)
      // other letter -> blocked (cannot pass through)
      return false;
    };

    const neighborsOf = (key: string) => {
      const [sx, sy] = key.split('-').map(s => parseInt(s, 10));
      const coords = [
        [sx + 1, sy],
        [sx - 1, sy],
        [sx, sy + 1],
        [sx, sy - 1],
      ];
      return coords
        .filter(([nx, ny]) => nx >= minX && nx <= maxX && ny >= minY && ny <= maxY)
        .map(([nx, ny]) => `${nx}-${ny}`);
    };

    let found = false;
    while (queue.length > 0 && !found) {
      const currentKey = queue.shift()!;
      if (currentKey === targetKey) {
        found = true;
        break;
      }

      for (const nKey of neighborsOf(currentKey)) {
        if (visited.has(nKey)) continue;

        const [nx, ny] = nKey.split('-').map(s => parseInt(s, 10));
        if (!isPassableForHint(nx, ny)) continue;

        visited.add(nKey);
        parent.set(nKey, currentKey);
        queue.push(nKey);
      }
    }

    if (!found) {
      startNotification(`No path found for ${hintLetter}`, 1600);
      return;
    }

    // reconstruct path from target to start
    const reconstructed: BoardCell[] = [];
    let cur: string | null = targetKey;
    while (cur) {
      const bc = cellMap.get(cur);
      if (!bc) break;
      reconstructed.push({ ...bc });
      cur = parent.get(cur) ?? null;
    }
    reconstructed.reverse(); // from start to target

    // Now finalize the path (same logic as manual finalize)
    // Remove overlapping connections if any
    const overlapping = findOverlappingConnections(reconstructed);
    if (overlapping.length > 0) {
      setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
      setBoard(prev => prev.map(c => {
        const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        return overlapped ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
      }));
      startNotification('Existing connection(s) removed by hint connection', 1100);
    }

    // Determine path color (prefer endpoint color)
    const endpointColor = cellMap.get(`${reconstructed[0].x}-${reconstructed[0].y}`)?.color
      || colorForLetter(reconstructed[0].letter);

    // Mark board cells as used and set color (preserve endpoint colors)
    setBoard(prev => prev.map(c => {
      const used = reconstructed.some(nc => nc.x === c.x && nc.y === c.y);
      const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
      if (used) return { ...c, isUsed: true, color: epColor ?? endpointColor };
      return c;
    }));

    // Build WordPath with color info
    const newFound: WordPath = {
      word: hintLetter,
      cells: reconstructed.map(p => {
        const b = cellMap.get(`${p.x}-${p.y}`);
        return { ...p, color: (b && b.color) || endpointColor };
      }),
      startIndex: 0
    };

    // Add to foundWords (replace any existing for same letter)
    setFoundWords(prev => {
      const withoutSame = prev.filter(p => p.word !== hintLetter);
      return [...withoutSame, newFound];
    });

    startNotification(`Hint: Connected ${hintLetter}`, 900);

    // reset any drawing state
    setActiveLetter(null);
    setSelectedPath([]);

    // check if all letters connected now
    const connected = [...foundWords.map(f => f.word), hintLetter].filter(Boolean) as string[];
    const uniqueConnected = Array.from(new Set(connected));
    const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));
    if (isComplete) {
      startNotification(t.congrats, 2000);
      if (gameMode === 'competitive') {
        setTimeout(() => nextLevel(), 2000);
      } else {
        setGameState('won');
      }
    }
  }, [
    currentLevel,
    board,
    foundWords,
    allLetters,
    endpointColorMap,
    colorForLetter,
    findOverlappingConnections,
    startNotification,
    gameMode,
    teams,
    currentTeam,
    consumeHint,
    t,
    nextLevel
  ]);

  const onUndo = useCallback(() => {
    if (foundWords.length === 0) return;
    const lastConnection = foundWords[foundWords.length - 1];
    setFoundWords(prev => prev.slice(0, -1));
    setBoard(prev => prev.map(c => {
      const wasUsed = lastConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
      if (!wasUsed) return c;
      const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
      return { ...c, isUsed: false, color: epColor ?? undefined };
    }));
    setSelectedPath([]);
    setActiveLetter(null);
    startNotification(`Undo: Removed connection for ${lastConnection.word}`);
    // if we were in won state and undone a connection, revert to playing
    if (gameState === 'won') setGameState('playing');
  }, [foundWords, startNotification, endpointColorMap, gameState]);

  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => {
      // Only keep the original endpoint colors, remove all other colors
      const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
      return { ...c, isUsed: false, color: epColor };
    }));
    setSelectedPath([]);
    setActiveLetter(null);
    setGameState('playing');
    startNotification('Game reset - all connections removed');
  }, [startNotification, endpointColorMap]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  return {
    loading,
    currentLevel,
    currentLevelIndex,
    board,
    selectedPath,
    foundWords,
    notification,
    gameState,
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
