import { createContext, useState, useCallback } from 'react';
import type { ReactNode, FC } from 'react';
import type {
  GameModeContextType,
  Team,
  Scores,
  Language,
  GameMode,
  GameType,
} from '../types/game';

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const GameModeProvider: FC<ProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameType, setGameType] = useState<GameType>('clue');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [scores, setScores] = useState<Scores>({});

  const initializeTeams = (teamCount: number, names?: string[]) => {
    const newTeams = Array.from({ length: teamCount }, (_, i) => ({
      id: i + 1,
      name: names?.[i] ?? `Team ${i + 1}`,
      score: 0,
    }));

    setTeams(newTeams);

    const newScores: Scores = {};
    newTeams.forEach((t) => (newScores[t.id] = 0));
    setScores(newScores);

    setCurrentTeam(0);
  };

  const renameTeam = (teamId: number, newName: string) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, name: newName } : t))
    );
  };

  const updateScore = (teamId: number, points: number) => {
    setScores((prev) => ({
      ...prev,
      [teamId]: (prev[teamId] || 0) + points,
    }));
  };

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

  const resetGame = () => {
    setGameMode('single');
    setGameType('clue');
    setTeams([]);
    setCurrentTeam(0);
    setScores({});
  };

  return (
    <GameModeContext.Provider
      value={{
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
        isRTL: language === 'ar',
      }}
    >
      {children}
    </GameModeContext.Provider>
  );
};

export { GameModeContext };
