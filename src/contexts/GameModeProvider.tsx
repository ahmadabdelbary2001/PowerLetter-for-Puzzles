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
  // Initialize language from localStorage or default to 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('powerletter-language');
    return (savedLanguage as Language) || 'en';
  });

  // Initialize game mode from localStorage or default to 'single'
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    const savedGameMode = localStorage.getItem('powerletter-gamemode');
    return (savedGameMode as GameMode) || 'single';
  });

  const [gameType, setGameType] = useState<GameType>('clue');

  // Load teams & scores from localStorage if present, otherwise default
  const [teams, setTeams] = useState<Team[]>(() => {
    const raw = localStorage.getItem('powerletter-teams');
    if (raw) {
      try {
        return JSON.parse(raw) as Team[];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [currentTeam, setCurrentTeam] = useState<number>(() => {
    const saved = localStorage.getItem('powerletter-currentteam');
    return saved ? parseInt(saved) : 0;
  });

  const [scores, setScores] = useState<Scores>(() => {
    const raw = localStorage.getItem('powerletter-scores');
    if (raw) {
      try {
        return JSON.parse(raw) as Scores;
      } catch {
        return {};
      }
    }
    return {};
  });

  // Keep a ref to teams for callbacks that might otherwise capture a stale value.
  const teamsRef = useRef<Team[]>(teams);
  useEffect(() => {
    teamsRef.current = teams;
  }, [teams]);

  // debounce timer ref for saves
  const saveTimerRef = useRef<number | null>(null);

  // Centralized debounced save: persist selected pieces of state to localStorage.
  useEffect(() => {
    // Debounce writes slightly to avoid many writes during rapid state updates.
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem('powerletter-language', language);
        localStorage.setItem('powerletter-gamemode', gameMode);
        localStorage.setItem('powerletter-teams', JSON.stringify(teams));
        localStorage.setItem('powerletter-scores', JSON.stringify(scores));
        localStorage.setItem('powerletter-currentteam', String(currentTeam));
      } catch {
        // If localStorage quota exceeded or unavailable, fail gracefully
        // Consider falling back to in-memory or IndexedDB for large data
        // console.warn('Failed to persist game state');
      }
      saveTimerRef.current = null;
    }, 150);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [language, gameMode, teams, scores, currentTeam]);

  // Sync across tabs/windows using the storage event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === 'powerletter-teams' && e.newValue) {
          const parsed = JSON.parse(e.newValue);
          // Avoid replacing if identical (cheap check)
          if (JSON.stringify(parsed) !== JSON.stringify(teamsRef.current)) {
            setTeams(parsed);
          }
        } else if (e.key === 'powerletter-scores' && e.newValue) {
          setScores(JSON.parse(e.newValue));
        } else if (e.key === 'powerletter-currentteam' && e.newValue) {
          setCurrentTeam(parseInt(e.newValue));
        } else if (e.key === 'powerletter-language' && e.newValue) {
          setLanguage(e.newValue as Language);
        } else if (e.key === 'powerletter-gamemode' && e.newValue) {
          setGameMode(e.newValue as GameMode);
        }
      } catch {
        // ignore parse errors
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

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
    setScores(prev => {
      const newScores = { ...prev, [teamId]: (prev[teamId] || 0) + points };
      return newScores;
    });
    setTeams(prev => prev.map(team => team.id === teamId ? { ...team, score: (team.score || 0) + points } : team));
  }, []);

  /**
   * Consume a hint for a team. Returns true if the hint was consumed (team had >0 hints).
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
