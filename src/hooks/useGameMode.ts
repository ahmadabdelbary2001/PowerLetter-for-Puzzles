// src/hooks/useGameMode.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Team, GameCategory } from '@/types/game';

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

      // --- Actions ---
      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategories: (categories) => set({ categories }),
      setCategory: (category: GameCategory) => set({ categories: [category] }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (currentTeam) => set({ currentTeam }),

      resetScores: (pointsAwarded: Record<number, number>) => {
        set((state) => {
          const newScores = { ...state.scores };
          const newTeams = state.teams.map(team => {
            const points = pointsAwarded[team.id] || 0;
            const newScore = (newScores[team.id] || 0) + points;
            newScores[team.id] = newScore;
            return { ...team, score: newScore };
          });
          return { scores: newScores, teams: newTeams };
        });
      },

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

      nextTurn: () => {
        set((state) => {
          const { teams, currentTeam, gameMode } = state;
          const n = teams.length;
          if (gameMode !== 'competitive' || n < 2) return {};
          return { currentTeam: (currentTeam + 1) % n };
        });
      },

      resetGame: () => {
        set({
          teams: [],
          scores: {},
          currentTeam: 0,
          categories: ['general'],
          difficulty: 'easy',
        });
      },
    }),
    {
      name: 'powerletter-game-storage',
    }
  )
);
