import { useState, useCallback } from 'react';
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
  const [currentTeam, setCurrentTeam] = useState(0);
  const [scores, setScores] = useState<Scores>({});

  const initializeTeams = useCallback((teamCount: number, names?: string[]) => {
    const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: i,
      name: names?.[i] || `Team ${i + 1}`,
      score: 0,
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
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, name: newName } : team
    ));
  }, []);

  const updateScore = useCallback((teamId: number, points: number) => {
    setScores(prev => ({ ...prev, [teamId]: (prev[teamId] || 0) + points }));
    // Also update the teams array to keep in sync
    setTeams(prev => prev.map(team => 
      team.id === teamId ? { ...team, score: team.score + points } : team
    ));
  }, []);

  const nextTurn = useCallback(
    (outcome: 'win' | 'lose') => {
      const n = teams.length;
      if (gameMode !== 'competitive' || n === 0) {
        setCurrentTeam((prev) => (prev + 1) % (n || 1));
        return;
      }

      let nextIndex: number;

      if (outcome === 'win') {
        nextIndex = (currentTeam + 1) % n;
      } else if (n % 2 === 0) {
        nextIndex = (currentTeam - 1 + n) % n;
      } else {
        const half = Math.floor(n / 2);
        nextIndex = (currentTeam - half + n) % n;
      }

      setCurrentTeam(nextIndex);
    },
    [currentTeam, gameMode, teams.length]
  );

  const resetGame = useCallback(() => {
    setTeams([]);
    setCurrentTeam(0);
    setScores({});
  }, []);

  const isRTL = language === 'ar';

  const value: GameModeContextType = {
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
    nextTurn,
    resetGame,
    isRTL,
  };

  return (
    <GameModeContext.Provider value={value}>
      {children}
    </GameModeContext.Provider>
  );
};