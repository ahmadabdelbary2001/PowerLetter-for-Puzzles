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
