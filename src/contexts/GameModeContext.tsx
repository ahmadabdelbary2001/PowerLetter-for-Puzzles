import { createContext } from 'react';
import type { Language, GameMode, GameType, Team, Scores } from '@/types/game';

export interface GameModeContextType {
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  gameMode: GameMode;
  setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;
  gameType: GameType;
  setGameType: React.Dispatch<React.SetStateAction<GameType>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  currentTeam: number;
  setCurrentTeam: React.Dispatch<React.SetStateAction<number>>;
  scores: Scores;
  setScores: React.Dispatch<React.SetStateAction<Scores>>;
  initializeTeams: (teamCount: number, names?: string[]) => void;
  renameTeam: (teamId: number, newName: string) => void;
  updateScore: (teamId: number, points: number) => void;
  nextTurn: (outcome: 'win' | 'lose') => void;
  resetGame: () => void;
  isRTL: boolean;
}

export const GameModeContext = createContext<GameModeContextType | undefined>(undefined);