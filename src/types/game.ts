import type { Dispatch, SetStateAction } from 'react';

export type Language = 'en' | 'ar';
export type GameMode = 'single' | 'competitive';
export type GameType = 'clue' | 'formation' | 'category';
export type Difficulty = 'easy' | 'medium' | 'hard';

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
  nextTurn: (outcome: 'win' | 'lose') => void;
  resetGame: () => void;
  isRTL: boolean;
}
