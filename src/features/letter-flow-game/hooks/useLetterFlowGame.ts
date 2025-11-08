// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * @description Final "assembler" hook for the Letter Flow game.
 * It assembles all logic and content needed by the UI.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameController } from '@/hooks/game/useGameController';
import { letterFlowGameEngine, type LetterFlowLevel, type BoardCell, type WordPath } from '../engine';
import { colorForString } from '../utils/colors';

export function useLetterFlowGame() {
  const controller = useGameController<LetterFlowLevel>({
    engine: letterFlowGameEngine,
    gameId: 'letterFlow',
  });

  const { currentLevel, gameModeState, t, nextLevel } = controller;
  const { gameMode, teams, currentTeam, consumeHint } = gameModeState;

  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selectedPath, setSelectedPath] = useState<BoardCell[]>([]);
  const [foundWords, setFoundWords] = useState<WordPath[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  useEffect(() => {
    if (currentLevel) {
      setBoard(currentLevel.board.map(c => ({ ...c })));
      setFoundWords([]);
      setSelectedPath([]);
      setActiveLetter(null);
      setGameState('playing');
    }
  }, [currentLevel]);

  const allLetters = useMemo(() => [...new Set(currentLevel?.endpoints.map(e => e.letter) || [])], [currentLevel]);
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
    return currentLevel?.endpoints.some(ep => ep.x === cell.x && ep.y === cell.y && ep.letter === cell.letter) ?? false;
  }, [currentLevel]);
  const findOverlappingConnections = useCallback((newPath: BoardCell[]) => {
    return foundWords.filter(path => path.cells.some(pc => newPath.some(nc => nc.x === pc.x && nc.y === pc.y)));
  }, [foundWords]);
  const startNotification = useCallback((text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', ms = 1200) => {
    setNotification({ message: text, type });
    if (ms > 0) setTimeout(() => setNotification(null), ms);
  }, []);

  const handleMouseDown = useCallback((cell: BoardCell) => {
    if (!isEndpoint(cell)) return;
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        return used ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
      }));
      startNotification(`Removed connection for ${cell.letter}`, 'info', 900);
    }
    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint, startNotification, endpointColorMap]);

  const handleMouseEnter = useCallback((cell: BoardCell) => {
    if (!activeLetter || selectedPath.length === 0) return;
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
    const isTargetEndpoint = isEndpoint(cell) && !(selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y) && cell.letter === activeLetter;
    if (isTargetEndpoint) {
      const overlapping = findOverlappingConnections(newPath);
      if (overlapping.length > 0) {
        setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
        setBoard(prev => prev.map(c => {
          const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
          return overlapped ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
        }));
        startNotification('Existing connection(s) removed by new connection', 'warning', 1100);
      }
      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color || colorForLetter(newPath[0].letter);
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        return used ? { ...c, isUsed: true, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? endpointColor } : c;
      }));
      const newFound: WordPath = { word: activeLetter!, cells: newPath.map(p => ({ ...p, color: endpointColor })), startIndex: 0 };
      setFoundWords(prev => [...prev.filter(p => p.word !== activeLetter), newFound]);
      startNotification(`Connected ${activeLetter}`, 'success', 900);
      setActiveLetter(null);
      setSelectedPath([]);
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      if (allLetters.every(letter => uniqueConnected.includes(letter))) {
        startNotification(t.congrats, 'success', 2000);
        if (gameMode === 'competitive') {
          setTimeout(() => nextLevel(), 2000);
        } else {
          setGameState('won');
        }
      }
    } else {
      setSelectedPath(newPath);
    }
  }, [activeLetter, selectedPath, isEndpoint, findOverlappingConnections, board, colorForLetter, foundWords, allLetters, nextLevel, t, startNotification, endpointColorMap, gameMode]);

  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      if (!isEndpoint(lastCell) || (selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) || lastCell.letter !== activeLetter) {
        setActiveLetter(null);
        setSelectedPath([]);
        startNotification('Path must connect two endpoints!', 'error', 1200);
      }
    }
  }, [selectedPath, isEndpoint, activeLetter, startNotification]);

  // --- FIX: The onHint function is now completely rewritten to be robust and correct. ---
  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= (currentLevel.endpoints.length / 2)) return;
    if (gameMode === 'competitive' && !consumeHint(teams[currentTeam].id)) {
      startNotification(t.noHintsLeft, 'error', 2000);
      return;
    }

    const unconnectedLetters = allLetters.filter(letter => !foundWords.some(path => path.word === letter));
    if (unconnectedLetters.length === 0) return;

    const hintLetter = unconnectedLetters[0];
    const endpoints = currentLevel.endpoints.filter(e => e.letter === hintLetter);
    if (endpoints.length < 2) {
      startNotification(`No path found for ${hintLetter}`, 'error', 1600);
      return;
    }

    // --- Pathfinding logic is now self-contained and uses fresh data ---
    const cellMap = new Map<string, BoardCell>();
    board.forEach(c => cellMap.set(`${c.x}-${c.y}`, c));

    const startKey = `${endpoints[0].x}-${endpoints[0].y}`;
    const targetKey = `${endpoints[1].x}-${endpoints[1].y}`;

    const queue: string[] = [startKey];
    const visited = new Set<string>([startKey]);
    const parent = new Map<string, string | null>([[startKey, null]]);
    let pathFound = false;

    while (queue.length > 0) {
      const currentKey = queue.shift()!;
      if (currentKey === targetKey) {
        pathFound = true;
        break;
      }
      const [sx, sy] = currentKey.split('-').map(Number);
      const neighbors = [[sx + 1, sy], [sx - 1, sy], [sx, sy + 1], [sx, sy - 1]];

      for (const [nx, ny] of neighbors) {
        const neighborKey = `${nx}-${ny}`;
        const cell = cellMap.get(neighborKey);
        if (cell && !visited.has(neighborKey) && (!cell.letter || cell.letter === hintLetter)) {
          visited.add(neighborKey);
          parent.set(neighborKey, currentKey);
          queue.push(neighborKey);
        }
      }
    }

    if (!pathFound) {
      startNotification(`No path found for ${hintLetter}`, 'error', 1600);
      return;
    }

    const reconstructedPath: BoardCell[] = [];
    let currentKey: string | null = targetKey;
    while (currentKey) {
      const cell = cellMap.get(currentKey);
      if (cell) reconstructedPath.unshift(cell);
      currentKey = parent.get(currentKey) ?? null;
    }

    // --- State update logic remains the same, but is now guaranteed to work ---
    const overlapping = findOverlappingConnections(reconstructedPath);
    if (overlapping.length > 0) {
      setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
      setBoard(prev => prev.map(c => {
        const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
        return overlapped ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
      }));
    }

    const endpointColor = colorForLetter(hintLetter);
    setBoard(prev => prev.map(c => {
      const used = reconstructedPath.some(nc => nc.x === c.x && nc.y === c.y);
      return used ? { ...c, isUsed: true, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? endpointColor } : c;
    }));

    const newFound: WordPath = { word: hintLetter, cells: reconstructedPath.map(p => ({ ...p, color: endpointColor })), startIndex: 0 };
    setFoundWords(prev => [...prev.filter(p => p.word !== hintLetter), newFound]);
    startNotification(`Hint: Connected ${hintLetter}`, 'info', 900);

    const isComplete = allLetters.every(letter => [...foundWords.map(f => f.word), hintLetter].includes(letter));
    if (isComplete) {
      startNotification(t.congrats, 'success', 2000);
      if (gameMode === 'competitive') {
        setTimeout(() => nextLevel(), 2000);
      } else {
        setGameState('won');
      }
    }
}, [currentLevel, board, foundWords, startNotification, t, allLetters, endpointColorMap, colorForLetter, findOverlappingConnections, nextLevel, consumeHint, currentTeam, teams, gameMode]);

  const onUndo = useCallback(() => {
    if (foundWords.length === 0) return;
    const lastConnection = foundWords[foundWords.length - 1];
    setFoundWords(prev => prev.slice(0, -1));
    setBoard(prev => prev.map(c => {
      const wasUsed = lastConnection.cells.some(cell => cell.x === c.x && cell.y === c.y);
      return wasUsed ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
    }));
    setSelectedPath([]);
    setActiveLetter(null);
    startNotification(`Undo: Removed connection for ${lastConnection.word}`, 'info');
    if (gameState === 'won') setGameState('playing');
  }, [foundWords, startNotification, endpointColorMap, gameState]);

  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => ({ ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) })));
    setSelectedPath([]);
    setActiveLetter(null);
    setGameState('playing');
    startNotification('Game reset - all connections removed', 'info');
  }, [startNotification, endpointColorMap]);

  return {
    ...controller,
    board,
    selectedPath,
    foundWords,
    notification,
    gameState,
    activeLetter,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    clearSelection: () => { setSelectedPath([]); setActiveLetter(null); },
    onHint,
    onUndo,
    onReset,
  };
}
