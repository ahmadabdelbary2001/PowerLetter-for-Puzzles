"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, GameMode, GameType, GameCategory, Difficulty } from '@powerletter/core';

interface GameSettingsState {
  language: Language;
  gameMode: GameMode;
  gameType: GameType | null;
  categories: GameCategory[];
  difficulty: Difficulty;
  isRTL: boolean;
  setLanguage: (language: Language) => void;
  setGameMode: (mode: GameMode) => void;
  setGameType: (type: GameType | null) => void;
  setCategories: (categories: GameCategory[]) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

export const useGameSettingsStore = create<GameSettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      gameMode: 'single',
      gameType: null,
      categories: ['general'],
      difficulty: 'easy',
      isRTL: false,

      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategories: (categories) => set({ categories }),
      setDifficulty: (difficulty) => set({ difficulty }),
    }),
    {
      name: 'powerletter-game-settings-storage',
    }
  )
);
