// src/features/letter-flow-game/hooks/useLetterFlowGame.ts
/**
 * @description Final "assembler" hook for the Letter Flow game.
 * --- It now uses the centralized notification system with translatable messageKeys. ---
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

  // --- Destructure `setNotification` from the controller. ---
  const { currentLevel, gameModeState, nextLevel, setNotification } = controller;
  const { gameMode, teams, currentTeam, consumeHint } = gameModeState;

  const [board, setBoard] = useState<BoardCell[]>([]);
  const [selectedPath, setSelectedPath] = useState<BoardCell[]>([]);
  const [foundWords, setFoundWords] = useState<WordPath[]>([]);
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

  const handleMouseDown = useCallback((cell: BoardCell) => {
    if (!isEndpoint(cell)) return;
    const existingConnection = foundWords.find(path => path.word === cell.letter);
    if (existingConnection) {
      setFoundWords(prev => prev.filter(path => path.word !== cell.letter));
      setBoard(prev => prev.map(c => {
        const used = existingConnection.cells.some(cc => cc.x === c.x && cc.y === c.y);
        return used ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
      }));
      // --- Use the new `connectionRemoved` messageKey with interpolation. ---
      setNotification({ messageKey: 'connectionRemoved', options: { letter: cell.letter }, type: 'info', duration: 900 });
    }
    setActiveLetter(cell.letter);
    setSelectedPath([cell]);
  }, [foundWords, isEndpoint, setNotification, endpointColorMap]);

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
      
      // --- Logic to choose the correct notification ---
      if (overlapping.length > 0) {
        // If there was an overlap, use the new combined message
        const oldLetters = overlapping.map(p => p.word).join(', ');
        setNotification({
          messageKey: 'connectionReplaced',
          options: { newLetter: activeLetter, oldLetters },
          type: 'warning',
          duration: 1500
        });
        setFoundWords(prev => prev.filter(p => !overlapping.includes(p)));
        setBoard(prev => prev.map(c => {
          const overlapped = overlapping.some(op => op.cells.some(cc => cc.x === c.x && cc.y === c.y));
          return overlapped ? { ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? undefined } : c;
        }));
      } else {
        // If no overlap, use the simple "connection made" message
        setNotification({ messageKey: 'connectionMade', options: { letter: activeLetter }, type: 'success', duration: 900 });
      }

      const endpointColor = board.find(b => b.x === newPath[0].x && b.y === newPath[0].y)?.color || colorForLetter(newPath[0].letter);
      setBoard(prev => prev.map(c => {
        const used = newPath.some(nc => nc.x === c.x && nc.y === c.y);
        return used ? { ...c, isUsed: true, color: endpointColorMap.get(`${c.x}-${c.y}`) ?? endpointColor } : c;
      }));
      const newFound: WordPath = { word: activeLetter!, cells: newPath.map(p => ({ ...p, color: endpointColor })), startIndex: 0 };
      setFoundWords(prev => [...prev.filter(p => p.word !== activeLetter), newFound]);
      
      setActiveLetter(null);
      setSelectedPath([]);
      
      const connected = [...foundWords.map(f => f.word), activeLetter].filter(Boolean) as string[];
      const uniqueConnected = Array.from(new Set(connected));
      if (allLetters.every(letter => uniqueConnected.includes(letter))) {
        setNotification({ messageKey: 'levelComplete', type: 'success', duration: 2000 });
        if (gameMode === 'competitive') {
          setTimeout(() => nextLevel(), 2000);
        } else {
          setGameState('won');
        }
      }
    } else {
      setSelectedPath(newPath);
    }
  }, [activeLetter, selectedPath, isEndpoint, findOverlappingConnections, board, colorForLetter, foundWords, allLetters, nextLevel, setNotification, endpointColorMap, gameMode]);

  const handleMouseUp = useCallback(() => {
    if (selectedPath.length > 0) {
      const lastCell = selectedPath[selectedPath.length - 1];
      if (!isEndpoint(lastCell) || (selectedPath.length > 1 && selectedPath[0].x === lastCell.x && selectedPath[0].y === lastCell.y) || lastCell.letter !== activeLetter) {
        setActiveLetter(null);
        setSelectedPath([]);
        // --- Use the new `pathInvalid` messageKey. ---
        setNotification({ messageKey: 'pathInvalid', type: 'error', duration: 1200 });
      }
    }
  }, [selectedPath, isEndpoint, activeLetter, setNotification]);

  const onHint = useCallback(() => {
    if (!currentLevel || foundWords.length >= (currentLevel.endpoints.length / 2)) return;
    if (gameMode === 'competitive' && !consumeHint(teams[currentTeam].id)) {
      setNotification({ messageKey: 'noMoreHints', type: 'error' });
      return;
    }
    // ... (rest of hint logic)
    const hintLetter = "A"; // Placeholder, this would be determined by your hint logic
    setNotification({ messageKey: 'hintRevealed', options: { letter: hintLetter }, type: 'info', duration: 900 });
    // ...
  }, [currentLevel, foundWords, setNotification, consumeHint, currentTeam, teams, gameMode]);

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
    // --- Use the new `connectionRemoved` messageKey with interpolation. ---
    setNotification({ messageKey: 'connectionRemoved', options: { letter: lastConnection.word }, type: 'info' });
    if (gameState === 'won') setGameState('playing');
  }, [foundWords, setNotification, endpointColorMap, gameState]);

  const onReset = useCallback(() => {
    setFoundWords([]);
    setBoard(prev => prev.map(c => ({ ...c, isUsed: false, color: endpointColorMap.get(`${c.x}-${c.y}`) })));
    setSelectedPath([]);
    setActiveLetter(null);
    setGameState('playing');
    // --- Use the new `connectionsReset` messageKey. ---
    setNotification({ messageKey: 'connectionsReset', type: 'info' });
  }, [setNotification, endpointColorMap]);

  // --- Return the controller's state, which includes the correct `notification` object. ---
  return {
    ...controller,
    board,
    selectedPath,
    foundWords,
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