// src/hooks/useGameMode.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, Team, GameCategory } from '@/types/game';

export const useGameMode = create<GameState>()(
  persist(
    (set, get) => ({
      language: 'en',
      gameMode: 'single',
      gameType: null,
      categories: ['general'],
      difficulty: 'easy',
      teams: [],
      currentTeam: 0,
      scores: {},
      isRTL: false,

      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (mode) => set({ gameMode: mode }),
      setGameType: (type) => set({ gameType: type }),
      
      setCategories: (categories) => {
        get().resetScores();
        set({ categories });
      },
      
      setCategory: (category: GameCategory) => {
        get().resetScores();
        set({ categories: [category] });
      },

      setDifficulty: (difficulty) => {
        get().resetScores();
        set({ difficulty });
      },

      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (teamId) => set({ currentTeam: teamId }),

      // This function is the key. It completely re-initializes the teams
      // and inherently resets their scores to 0, fulfilling both requirements.
      initializeTeams: (teamCount, names = [], hintsPerTeam = 3) => {
        const newTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
          id: i,
          name: names[i] || `${'Team'} ${i + 1}`, // Fallback name
          score: 0, // Score is always reset to 0 here
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
          const newScore = currentScore + points;
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

      nextTurn: () => {
        set((state) => {
          if (state.gameMode !== 'competitive' || state.teams.length < 2) return {};
          return { currentTeam: (state.currentTeam + 1) % state.teams.length };
        });
      },

      resetScores: () => {
        set(state => {
          const resetScores = Object.keys(state.scores).reduce((acc, key) => {
            acc[Number(key)] = 0;
            return acc;
          }, {} as Record<number, number>);
          
          const resetTeams = state.teams.map(team => ({ ...team, score: 0 }));

          return { scores: resetScores, teams: resetTeams };
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
