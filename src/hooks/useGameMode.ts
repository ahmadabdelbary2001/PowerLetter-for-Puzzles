// src/hooks/useGameMode.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Team, GameCategory, Difficulty, GameMode, GameType, Language } from '@/types/game';

export const useGameMode = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state values
      language: 'en',
      gameMode: 'single',
      gameType: null,
      categories: ['general'],
      difficulty: 'easy',
      teams: [],
      currentTeam: 0,
      scores: {},
      isRTL: false,

      // Actions
      setLanguage: (language: Language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (mode: GameMode) => set({ gameMode: mode }),
      setGameType: (type: GameType) => set({ gameType: type }),
      
      // FIX: Implemented both setCategory and setCategories to satisfy the interface
      // `setCategory` will replace the array with a single new category
      setCategory: (category: GameCategory) => set({ categories: [category] }),
      // `setCategories` will set the array to a new array (for multi-select)
      setCategories: (categories: GameCategory[]) => set({ categories }),

      setDifficulty: (difficulty: Difficulty) => set({ difficulty }),
      setTeams: (teams: Team[]) => set({ teams }),
      setCurrentTeam: (teamId: number) => set({ currentTeam: teamId }),

      initializeTeams: (teamCount, names = [], hintsPerTeam = 3) => {
        const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
          id: i,
          name: names?.[i] ?? `Team ${i + 1}`,
          score: 0,
          hintsRemaining: hintsPerTeam,
        }));
        const newScores = newTeams.reduce((acc, team) => ({ ...acc, [team.id]: 0 }), {});
        set({ teams: newTeams, scores: newScores, currentTeam: 0 });
      },

      renameTeam: (teamId, newName) => {
        set((state) => ({
          teams: state.teams.map((team) => (team.id === teamId ? { ...team, name: newName } : team)),
        }));
      },

      updateScore: (teamId, points) => {
        set((state) => {
          const newScore = (state.scores[teamId] || 0) + points;
          return {
            scores: { ...state.scores, [teamId]: newScore },
            teams: state.teams.map((team) =>
              team.id === teamId ? { ...team, score: newScore } : team
            ),
          };
        });
      },

      consumeHint: (teamId) => {
        const team = get().teams.find((t) => t.id === teamId);
        if (!team || team.hintsRemaining <= 0) return false;
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? { ...t, hintsRemaining: t.hintsRemaining - 1 } : t)),
        }));
        return true;
      },

      // FIX: Removed unused 'outcome' variable
      nextTurn: () => {
        set((state) => {
          const { teams, currentTeam } = state;
          if (teams.length < 2) return {};
          const next = (currentTeam + 1) % teams.length;
          return { currentTeam: next };
        });
      },

      resetGame: () => {
        set({
            teams: [],
            scores: {},
            currentTeam: 0
        });
      },
    }),
    {
      name: 'powerletter-game-storage',
    }
  )
);
