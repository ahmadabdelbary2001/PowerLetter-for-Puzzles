/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type {
  ReactNode,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';

export type Language = 'en' | 'ar';
export type GameMode = 'single' | 'competitive';
export type GameType = 'clue' | 'formation' | 'category';

export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface Scores {
  [teamId: number]: number;
}

export interface GameModeContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  gameMode: GameMode;
  setGameMode: Dispatch<SetStateAction<GameMode>>;
  gameType: GameType;
  setGameType: Dispatch<SetStateAction<GameType>>;
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
  currentTeam: number;
  setCurrentTeam: Dispatch<SetStateAction<number>>;
  scores: Scores;
  setScores: Dispatch<SetStateAction<Scores>>;
  initializeTeams: (teamCount: number) => void;
  updateScore: (teamId: number, points: number) => void;
  nextTurn: () => void;
  resetGame: () => void;
  isRTL: boolean;
}

const GameModeContext = createContext<GameModeContextType | undefined>(undefined);

export const useGameMode = (): GameModeContextType => {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
};

interface GameModeProviderProps {
  children: ReactNode;
}

export const GameModeProvider: FC<GameModeProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [gameMode, setGameMode] = useState<GameMode>('single');
  const [gameType, setGameType] = useState<GameType>('clue');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<number>(0);
  const [scores, setScores] = useState<Scores>({});

  const initializeTeams = (teamCount: number) => {
    const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      id: i + 1,
      name: `Team ${i + 1}`,
      score: 0,
    }));
    setTeams(newTeams);

    const newScores: Scores = {};
    newTeams.forEach(t => {
      newScores[t.id] = 0;
    });
    setScores(newScores);
    setCurrentTeam(0);
  };

  const updateScore = (teamId: number, points: number) =>
    setScores(prev => ({ ...prev, [teamId]: (prev[teamId] || 0) + points }));

  const nextTurn = () =>
    setCurrentTeam(prev => (teams.length ? (prev + 1) % teams.length : 0));

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
