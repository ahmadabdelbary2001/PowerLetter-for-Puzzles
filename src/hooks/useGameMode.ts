// src/hooks/useGameMode.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Team } from '@/types/game';

// Create the Zustand store, which implements the GameState interface
export const useGameMode = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state values
      language: 'en',
      gameMode: 'single',
      gameType: 'clue',
      category: 'animals', // Default category
      difficulty: 'easy',   // Default difficulty
      teams: [],
      currentTeam: 0,
      scores: {},
      isRTL: false,

      // Implementations of all actions
      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategory: (category) => set({ category }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (currentTeam) => set({ currentTeam }),

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
          const newScores = { ...state.scores, [teamId]: (state.scores[teamId] || 0) + points };
          const newTeams = state.teams.map((team) =>
            team.id === teamId ? { ...team, score: newScores[teamId] } : team
          );
          return { scores: newScores, teams: newTeams };
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

      nextTurn: () => {
        set((state) => {
          if (state.teams.length > 0) {
            return { currentTeam: (state.currentTeam + 1) % state.teams.length };
          }
          return {};
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
      name: 'powerletter-game-storage', // This is the key for localStorage
    }
  )
);
