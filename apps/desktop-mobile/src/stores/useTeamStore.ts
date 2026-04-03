// src/stores/useTeamStore.ts
/**
 * @description A Zustand store for managing the state of teams in competitive mode.
 * This includes team details, scores, hints, and turn-taking logic.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Team } from '@/types/game';

// Define the shape of the team state and its actions
interface TeamState {
  teams: Team[];
  currentTeam: number;
  scores: Record<number, number>;
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

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      // Initial state values
      teams: [],
      currentTeam: 0,
      scores: {},

      // --- Actions ---
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
          const newScore = (state.scores[teamId] || 0) + points;
          return {
            scores: { ...state.scores, [teamId]: newScore },
            teams: state.teams.map((team) =>
              team.id === teamId ? { ...team, score: newScore } : team
            ),
          };
        });
      },
      
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
          const { teams, currentTeam } = state;
          const n = teams.length;
          if (n < 2) return {};

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
          currentTeam: 0,
        });
      },
    }),
    {
      name: 'powerletter-team-storage', // Use a new name for the persisted storage
    }
  )
);
