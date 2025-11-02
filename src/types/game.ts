// src/types/game.ts
export type Language = 'en' | 'ar';
export type GameMode = 'single' | 'competitive';
export type GameType =
  | 'clue'
  | 'formation'
  | 'category'
  | 'image-clue'
  | 'word-choice'
  | 'picture-choice'
  | 'letter-flow';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameCategory = 'animals' | 'science' | 'geography' | 'fruits' | 'shapes' | 'general';

export type GameId = string;

export interface GameLevel {
  id: string;
  name: string;
  difficulty: Difficulty;
  category: GameCategory;
  data: unknown; // was any — now unknown to avoid eslint no-explicit-any
}

export interface Team {
  id: number;
  name: string;
  score: number;
  hintsRemaining: number;
}

export interface Scores {
  [teamId: number]: number;
}

export interface GameState {
  language: Language;
  gameMode: GameMode;
  gameType: GameType | null;
  category: GameCategory;
  difficulty: Difficulty;
  teams: Team[];
  currentTeam: number;
  scores: Scores;
  isRTL: boolean;

  setLanguage: (language: Language) => void;
  setGameMode: (mode: GameMode) => void;
  setGameType: (type: GameType) => void;
  setCategory: (category: GameCategory) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (teamId: number) => void;
  initializeTeams: (teamCount: number, names?: string[], hintsPerTeam?: number) => void;
  renameTeam: (teamId: number, newName: string) => void;
  updateScore: (teamId: number, points: number) => void;
  consumeHint: (teamId: number) => boolean;
  nextTurn: (outcome: 'win' | 'lose') => void;
  resetGame: () => void;
}
