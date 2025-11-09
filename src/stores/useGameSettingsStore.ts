// src/stores/useGameSettingsStore.ts
/**
 * @description A Zustand store for managing global game settings.
 * This store holds the configuration that is selected before a game starts,
 * such as language, game mode, and difficulty.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, GameMode, GameType, GameCategory, Difficulty } from '@/types/game';

// Define the shape of the settings state and its actions
interface GameSettingsState {
  language: Language;
  gameMode: GameMode;
  gameType: GameType | null;
  categories: GameCategory[];
  difficulty: Difficulty;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  setGameMode: (mode: GameMode) => void;
  setGameType: (type: GameType) => void;
  setCategories: (categories: GameCategory[]) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useGameSettingsStore = create<GameSettingsState>()(
  persist(
    (set) => ({
      // Initial state values
      language: 'en',
      gameMode: 'single',
      gameType: null,
      categories: ['general'],
      difficulty: 'easy',
      isRTL: false,

      // --- Actions ---
      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategories: (categories) => set({ categories }),
      setDifficulty: (difficulty) => set({ difficulty }),
    }),
    {
      name: 'powerletter-game-settings-storage', // Use a new name for the persisted storage
    }
  )
);
