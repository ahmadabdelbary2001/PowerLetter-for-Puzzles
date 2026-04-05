// Shared game types — used by desktop-mobile, web, and future packages
export type Language = 'en' | 'ar';
export type GameMode = 'single' | 'competitive';
export type GameType =
  | 'category'
  | 'phrase-clue'
  | 'formation'
  | 'image-clue'
  | 'letter-flow'
  | 'outside-the-story'
  | 'img-choice'
  | 'word-choice';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationData {
  messageKey: string;
  type?: NotificationType;
  duration?: number;
  options?: Record<string, string | number>; // For interpolation
}

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

export interface GameMetadata {
  id: GameType;
  type: 'adult' | 'kids';
  availableCategories?: GameCategory[];
  supportedSettings: ('teams' | 'difficulty' | 'category')[];
}

export const GAME_METADATA: GameMetadata[] = [
  {
    id: 'phrase-clue',
    type: 'adult',
    availableCategories: ['animals', 'science', 'geography', 'general'],
    supportedSettings: ['teams', 'difficulty', 'category'],
  },
  {
    id: 'formation',
    type: 'adult',
    supportedSettings: ['teams', 'difficulty'],
  },
  {
    id: 'letter-flow',
    type: 'adult',
    supportedSettings: ['teams', 'difficulty'],
  },
  {
    id: 'outside-the-story',
    type: 'adult',
    supportedSettings: ['teams', 'category'],
    availableCategories: [
      'animals', 'anime', 'cars', 'cartoons', 'characters', 'clothes',
      'drinks', 'foods', 'football', 'fruits-and-vegetables', 'gamers',
      'geography', 'k-pop', 'science', 'series', 'spy', 'sweets'
    ],
  },
  {
    id: 'image-clue',
    type: 'kids',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
  {
    id: 'img-choice',
    type: 'kids',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
  {
    id: 'word-choice',
    type: 'kids',
    supportedSettings: ['teams', 'category'],
    availableCategories: ['animals', 'fruits-and-vegetables', 'shapes', 'general'],
  },
];

export type GameId = string;

export interface GameLevel {
  id: string;
  name?: string;
  difficulty?: Difficulty;
  category?: GameCategory;
  data?: unknown;
}

export interface IGameEngine<T extends GameLevel> {
  loadLevels: (options: {
    language: Language;
    categories: GameCategory[];
    difficulty?: Difficulty;
  }) => Promise<T[]>;
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
