// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * @description Custom hook to manage the state and logic for the Letter Flow game.
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useGame } from '@/hooks/useGame';
import { letterFlowGameEngine, type LetterFlowLevel, type BoardCell, type WordPath } from '../engine';
import { colorForString } from '../utils/colors';

/**
 * Custom hook for managing the Letter Flow game logic and state.
 * This hook handles game initialization, board state, user interactions, and game progression.
 */
export function useLetterFlowGame() {
  // Navigation and URL parameters
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  // Game mode configuration and settings
  const { language, categories, difficulty, gameMode, teams, currentTeam, consumeHint } = useGameMode();
  const { t } = useTranslation();

  // --- Destructure `nextLevel` to be used and exported ---
  const { loading, currentLevel, currentLevelIndex, nextLevel } = useGame<LetterFlowLevel>(
    letterFlowGameEngine,
    { language, categories, difficulty }
  );

  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selectedPath, setSelectedPath] = useState<BoardCell[]>([]);
  const [foundWords, setFoundWords] = useState<WordPath[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'won'>('playing');

  // All useEffects, memoized values, and helper functions remain the same.
  useEffect(() => {
    if (!currentLevel) return;
    if (currentLevel.board && currentLevel.board.length > 0 && currentLevel.board.some(c => c.letter)) {
      setBoard(currentLevel.board.map(c => ({ ...c })));
    } else {
      const newBoard = letterFlowGameEngine.generateBoard("", currentLevel.difficulty, language, currentLevel.board.map(cell => cell.letter).join(""));
      setBoard(newBoard);
    }
    setFoundWords([]);
    setSelectedPath([]);
    setActiveLetter(null);
    setGameState('playing');
  }, [currentLevel, language]);

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
  const isBlockedForActive = useCallback((cell: BoardCell, start: BoardCell | null, activeLetterLocal: string | null) => {
    if (!cell.letter) {
      if (cell.isUsed) {
        if (activeLetterLocal) {
          const ownConn = foundWords.find(p => p.word === activeLetterLocal);
          if (ownConn && ownConn.cells.some(cc => cc.x === cell.x && cc.y === cell.y)) {
            return false;
          }
        }
        return true;
      }
      return false;
    }
    if (start && cell.x === start.x && cell.y === start.y) return false;
    if (activeLetterLocal && cell.letter === activeLetterLocal && isEndpoint(cell)) return false;
    return true;
  }, [foundWords, isEndpoint]);
  const findOverlappingConnections = useCallback((newPath: BoardCell[]) => {
    if (foundWords.length === 0) return [] as WordPath[];
    return foundWords.filter(path => path.cells.some(pc => newPath.some(nc => nc.x === pc.x && nc.y === pc.y)));
  }, [foundWords]);
  const startNotification = useCallback((text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info', ms = 1200) => {
    setNotification({ message: text, type });
    if (ms > 0) setTimeout(() => setNotification(null), ms);
  }, []);

  // All mouse and game action handlers remain the same.
  const handleMouseDown = useCallback((cell: BoardCell) => {
    if (!isEndpoint(cell)) return;
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        return used ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
      }));
      startNotification(`Removed connection for ${cell.letter}`, 'info', 900);
    }
    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint, startNotification, endpointColorMap]);
  const handleMouseEnter = useCallback((cell: BoardCell) => {
    if (!activeLetter || selectedPath.length === 0) return;
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
    const isTargetEndpoint = isEndpoint(cell) && !(selectedPath.length > 0 && selectedPath[0].x === cell.x && selectedPath[0].y === cell.y) && cell.letter === activeLetter;
    if (isTargetEndpoint) {
      const overlapping = findOverlappingConnections(newPath);
      if (overlapping.length > 0) {
        setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
        setBoard(prev => prev.map(c => {
          const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
          const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
          return overlapped ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
        }));
        startNotification('Existing connection(s) removed by new connection', 'warning', 1100);
      }
      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color || colorForLetter(newPath[0].letter);
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        if (used) return { ...c, isUsed: true, color: epColor ?? endpointColor };
        return c;
      }));
      const newFound: WordPath = { word: activeLetter!, cells: newPath.map(p => ({ ...p, color: endpointColor })), startIndex: 0 };
      setFoundWords(prev => [...prev.filter(p => p.word !== activeLetter), newFound]);
      startNotification(`Connected ${activeLetter}`, 'success', 900);
      setActiveLetter(null);
      setSelectedPath([]);
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));
      if (isComplete) {
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
  }, [activeLetter, selectedPath, isBlockedForActive, isEndpoint, isValidPath, findOverlappingConnections, board, colorForLetter, foundWords, allLetters, nextLevel, t, startNotification, endpointColorMap, gameMode, setGameState]);
  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      const isConnectedToEndpoint = isEndpoint(lastCell) && !(selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) && lastCell.letter === activeLetter;
      if (!isConnectedToEndpoint) {
        setActiveLetter(null);
        setSelectedPath([]);
        startNotification('Path must connect two endpoints!', 'error', 1200);
      }
    }
  }, [selectedPath, isEndpoint, activeLetter, startNotification]);
  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= (currentLevel.endpoints.length / 2)) return;
    if (gameMode === 'competitive') {
      if (!consumeHint(teams[currentTeam].id)) {
        startNotification(t.noHintsLeft, 'error', 2000);
        return;
      }
    }
    const unconnectedLetters = allLetters.filter(letter => !foundWords.some(path => path.word === letter));
    if (unconnectedLetters.length === 0) return;
    const hintLetter = unconnectedLetters[0] as string;
    const endpoints = currentLevel.endpoints.filter(e => e.letter === hintLetter);
    if (endpoints.length < 2) {
      startNotification(`No endpoints found for ${hintLetter}`, 'error', 1500);
      return;
    }
    const startEP = endpoints[0];
    const targetEP = endpoints[1];
    const cellMap = new Map<string, BoardCell>();
    board.forEach(c => cellMap.set(`${c.x}-${c.y}`, c));
    const xs = board.map(c => c.x); const ys = board.map(c => c.y);
    const minX = Math.min(...xs); const maxX = Math.max(...xs);
    const minY = Math.min(...ys); const maxY = Math.max(...ys);
    const startKey = `${startEP.x}-${startEP.y}`;
    const targetKey = `${targetEP.x}-${targetEP.y}`;
    const queue: string[] = [startKey];
    const visited = new Set<string>([startKey]);
    const parent = new Map<string, string | null>([[startKey, null]]);
    const isPassableForHint = (nx: number, ny: number) => {
      const c = cellMap.get(`${nx}-${ny}`);
      return c ? !c.letter || c.letter === hintLetter : false;
    };
    const neighborsOf = (key: string) => {
      const [sx, sy] = key.split('-').map(s => parseInt(s, 10));
      return [[sx + 1, sy], [sx - 1, sy], [sx, sy + 1], [sx, sy - 1]].filter(([nx, ny]) => nx >= minX && nx <= maxX && ny >= minY && ny <= maxY).map(([nx, ny]) => `${nx}-${ny}`);
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
      startNotification(`No path found for ${hintLetter}`, 'error', 1600);
      return;
    }
    const reconstructed: BoardCell[] = [];
    let cur: string | null = targetKey;
    while (cur) {
      const bc = cellMap.get(cur);
      if (bc) reconstructed.push({ ...bc });
      cur = parent.get(cur) ?? null;
    }
    reconstructed.reverse();
    const overlapping = findOverlappingConnections(reconstructed);
    if (overlapping.length > 0) {
      setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
      setBoard(prev => prev.map(c => {
        const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
        const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
        return overlapped ? { ...c, isUsed: false, color: epColor ?? undefined } : c;
      }));
      startNotification('Existing connection(s) removed by hint connection', 'warning', 1100);
    }
    const endpointColor = cellMap.get(`${reconstructed[0].x}-${reconstructed[0].y}`)?.color || colorForLetter(reconstructed[0].letter);
    setBoard(prev => prev.map(c => {
      const used = reconstructed.some(nc => nc.x === c.x && nc.y === c.y);
      const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
      if (used) return { ...c, isUsed: true, color: epColor ?? endpointColor };
      return c;
    }));
    const newFound: WordPath = { word: hintLetter, cells: reconstructed.map(p => ({ ...p, color: endpointColor })), startIndex: 0 };
    setFoundWords(prev => [...prev.filter(p => p.word !== hintLetter), newFound]);
    startNotification(`Hint: Connected ${hintLetter}`, 'info', 900);
    setActiveLetter(null);
    setSelectedPath([]);
    const connected = [...foundWords.map(f => f.word), hintLetter].filter(Boolean) as string[];
    const uniqueConnected = Array.from(new Set(connected));
    const isComplete = allLetters.every(letter => uniqueConnected.includes(letter));
    if (isComplete) {
      startNotification(t.congrats, 'success', 2000);
      if (gameMode === 'competitive') {
        setTimeout(() => nextLevel(), 2000);
      } else {
        setGameState('won');
      }
    }
  }, [currentLevel, board, foundWords, allLetters, endpointColorMap, colorForLetter, findOverlappingConnections, startNotification, gameMode, teams, currentTeam, consumeHint, t, nextLevel, setGameState]);
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
    startNotification(`Undo: Removed connection for ${lastConnection.word}`, 'info');
    if (gameState === 'won') setGameState('playing');
  }, [foundWords, startNotification, endpointColorMap, gameState, setGameState]);
  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => {
      const epColor = endpointColorMap.get(`${c.x}-${c.y}`);
      return { ...c, isUsed: false, color: epColor };
    }));
    setSelectedPath([]);
    setActiveLetter(null);
    setGameState('playing');
    startNotification('Game reset - all connections removed', 'info');
  }, [startNotification, endpointColorMap, setGameState]);
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
    board,
    selectedPath,
    foundWords,
    notification,
    gameState,
    activeLetter,
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    clearSelection: () => { setSelectedPath([]); setActiveLetter(null); },
    onHint,
    onUndo,
    onReset,
    nextLevel,
  };
}
