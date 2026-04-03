// packages/core/src/types/game.ts
// Shared domain types — used by desktop-mobile, web, and future packages

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
export type AgeGroup = 'kids' | 'adult';

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

/**
 * Contract every game engine must implement.
 */
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

/**
 * Metadata for a registered game — used by GameRegistry.
 */
export interface GameRegistryEntry {
  id: GameType;
  ageGroup: AgeGroup;
  titleKey: string;
  descriptionKey: string;
  featuresKey: string;
  status: 'available' | 'coming-soon';
  supportedSettings: Array<'teams' | 'difficulty' | 'category'>;
  availableCategories?: GameCategory[];
  tags?: string[];
  difficultyLevels?: Difficulty[];
}

// ── Lesson types (Phase 6) ────────────────────────────────────────
export type LessonType = 'animal' | 'country' | 'vocabulary';

export interface AnimalLesson {
  type: 'animal';
  id: string;
  name: Record<Language, string>;
  imageUrl?: string;
  soundUrl?: string;
  facts?: Record<Language, string[]>;
}

export interface CountryLesson {
  type: 'country';
  id: string;
  name: Record<Language, string>;
  capital: Record<Language, string>;
  flagUrl?: string;
  info?: Record<Language, string>;
}

export interface VocabularyLesson {
  type: 'vocabulary';
  id: string;
  word: Record<Language, string>;
  meaning: Record<Language, string>;
  example?: Record<Language, string>;
  audioUrl?: string;
}

export type Lesson = AnimalLesson | CountryLesson | VocabularyLesson;
