// src/hooks/useGameMode.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Team, GameCategory } from '@/types/game';

// واجهة الحالة الجديدة مع تعديل نوع الفئة
export interface GameStateWithMultiCategory extends Omit<GameState, 'category' | 'setCategory'> {
  categories: GameCategory[]; // FIX: Changed from 'category' to 'categories' (plural array)
  setCategories: (categories: GameCategory[]) => void; // FIX: New setter for the array
}

export const useGameMode = create<GameStateWithMultiCategory>()(
  persist(
    (set, get) => ({
      // Initial state values
      language: 'en',
      gameMode: 'single',
      gameType: 'clue',
      categories: ['animals'], // FIX: Default to an array with one category
      difficulty: 'easy',
      teams: [],
      currentTeam: 0,
      scores: {},
      isRTL: false,

      // Implementations of all actions
      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategories: (categories) => set({ categories }), // FIX: Implement the new setter
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
          const currentScore = Number(state.scores[teamId] || 0);
          const pointsToAdd = Number(points);
          const newScore = currentScore + pointsToAdd;

          const newScores = { ...state.scores, [teamId]: newScore };
          const newTeams = state.teams.map((team) =>
            team.id === teamId ? { ...team, score: newScore } : team
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

      nextTurn: (outcome: 'win' | 'lose') => {
        set((state) => {
          const { teams, currentTeam, gameMode } = state;
          const n = teams.length;
          if (gameMode !== 'competitive' || n < 2) return {};

          let next: number;
          if (outcome === 'win') {
            next = (currentTeam + 1) % n;
          } else {
            if (n % 2 === 0) {
              next = (currentTeam - 1 + n) % n;
            } else {
              const half = Math.floor(n / 2);
              next = (currentTeam - half + n) % n;
            }
          }
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
