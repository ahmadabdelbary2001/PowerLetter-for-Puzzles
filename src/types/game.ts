// src/types/game.ts
export type Language = 'en' | 'ar';
export type GameMode = 'single' | 'competitive';
export type GameType =
  | 'category'
  | 'phrase-clue'
  | 'formation'
  | 'image-clue'
  | 'letter-flow'
  | 'outside-the-story'
  | 'picture-choice'
  | 'word-choice';
export type Difficulty = 'easy' | 'medium' | 'hard';

// --- CRITICAL FIX ---
// Added all the new categories from the directory structure.
export type GameCategory = 
  | 'animals' 
  | 'science' 
  | 'geography' 
  | 'fruits-and-vegetables' 
  | 'shapes' 
  | 'general'
  | 'anime'
  | 'cars'
  | 'cartoons'
  | 'characters'
  | 'clothes'
  | 'drinks'
  | 'foods'
  | 'football'
  | 'gamers'
  | 'k-pop'
  | 'series'
  | 'spy'
  | 'sweets';

export type GameId = string;

export interface GameLevel {
  id: string;
  name?: string;
  difficulty?: Difficulty;
  category?: GameCategory;
  data?: unknown;
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
  categories: GameCategory[];
  difficulty: Difficulty;
  teams: Team[];
  currentTeam: number;
  scores: Scores;
  isRTL: boolean;

  setLanguage: (language: Language) => void;
  setGameMode: (mode: GameMode) => void;
  setGameType: (type: GameType) => void;
  setCategories: (categories: GameCategory[]) => void;
  setCategory: (category: GameCategory) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTeams: (teams: Team[]) => void;
  setCurrentTeam: (teamId: number) => void;
  initializeTeams: (teamCount: number, names?: string[], hintsPerTeam?: number) => void;
  renameTeam: (teamId: number, newName: string) => void;
  updateScore: (teamId: number, points: number) => void;
  resetScores: (pointsAwarded: Record<number, number>) => void;
  consumeHint: (teamId: number) => boolean;
  nextTurn: (outcome: 'win' | 'lose') => void;
  resetGame: () => void;
}
