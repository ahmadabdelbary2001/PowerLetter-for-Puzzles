// src/contexts/GameModeProvider.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { GameModeContext } from './GameModeContext';
import type {
  GameModeContextType,
  Language,
  GameMode,
  GameType,
  Team,
  Scores
} from '@/types/game';

interface GameModeProviderProps {
  children: ReactNode;
}

export const GameModeProvider: React.FC<GameModeProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameType, setGameType] = useState<GameType>('clue');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<number>(0);
  const [scores, setScores] = useState<Scores>({});

  // Keep a ref to teams for callbacks that might otherwise capture a stale value.
  const teamsRef = useRef<Team[]>(teams);
  useEffect(() => {
    teamsRef.current = teams;
  }, [teams]);

  /**
   * Initialize teams with optional names and hintsPerTeam.
   * hintsPerTeam defaults to 3 if not provided.
   */
  const initializeTeams = useCallback((teamCount: number, names?: string[], hintsPerTeam = 3) => {
    const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: i,
      name: names?.[i] ?? `Team ${i + 1}`,
      score: 0,
      hintsRemaining: hintsPerTeam,
    }));
    setTeams(newTeams);
    setCurrentTeam(0);

    // Initialize scores to 0 for each team
    const initialScores: Scores = {};
    newTeams.forEach(team => {
      initialScores[team.id] = 0;
    });
    setScores(initialScores);
  }, []);

  const renameTeam = useCallback((teamId: number, newName: string) => {
    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, name: newName } : team));
  }, []);

  const updateScore = useCallback((teamId: number, points: number) => {
    setScores(prev => ({ ...prev, [teamId]: (prev[teamId] || 0) + points }));
    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, score: (team.score || 0) + points } : team));
  }, []);

  /**
   * Consume a hint for a team. Returns true if the hint was consumed (team had >0 hints).
   * This function is intended to be called from the game UI when a hint is requested.
   */
  const consumeHint = useCallback((teamId: number): boolean => {
    const current = teamsRef.current.find(t => t.id === teamId);
    if (!current || current.hintsRemaining <= 0) {
      return false;
    }
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, hintsRemaining: Math.max(0, t.hintsRemaining - 1) } : t));
    return true;
  }, []);

  const nextTurn = useCallback((outcome: 'win' | 'lose') => {
    const n = teams.length;
    if (gameMode !== 'competitive' || n === 0) {
      setCurrentTeam(prev => (prev + 1) % (n || 1));
      return;
    }
    let next: number;
    if (outcome === 'win') {
      next = (currentTeam + 1) % n;
    } else {
      if (n % 2 === 0) {
        next = (currentTeam - 1 + n) % n;
      } else {
        const half = Math.floor(n / 2);
        next = (currentTeam - half + n) % n;
      }
    }
    setCurrentTeam(next);
  }, [currentTeam, gameMode, teams.length]);

  const resetGame = useCallback(() => {
    setTeams([]);
    setCurrentTeam(0);
    setScores({});
  }, []);

  const isRTL = language === 'ar';

  const value: GameModeContextType = useMemo(() => ({
    language,
    setLanguage,
    gameMode,
    setGameMode,
    gameType,
    setGameType,
    teams,
    setTeams,
    currentTeam,
    setCurrentTeam,
    scores,
    setScores,
    initializeTeams,
    renameTeam,
    updateScore,
    consumeHint,
    nextTurn,
    resetGame,
    isRTL,
  }), [
    language, setLanguage,
    gameMode, setGameMode,
    gameType, setGameType,
    teams, setTeams,
    currentTeam, setCurrentTeam,
    scores, setScores,
    initializeTeams, renameTeam, updateScore, consumeHint, nextTurn, resetGame, isRTL
  ]);

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
};
