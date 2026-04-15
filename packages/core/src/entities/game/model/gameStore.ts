import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Team, Scores, GameState,
} from '@core/shared/types/game';

const DEFAULT_HINTS = 3;

function buildTeams(count: number, names?: string[], hints = DEFAULT_HINTS): Team[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names?.[i] ?? `Team ${i + 1}`,
    score: 0,
    hintsRemaining: hints,
  }));
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      language: 'en',
      gameMode: 'single',
      gameType: null,
      categories: ['general'],
      difficulty: 'easy',
      teams: [],
      currentTeam: 1,
      scores: {},
      isRTL: false,

      setLanguage: (language) => set({ language, isRTL: language === 'ar' }),
      setGameMode: (gameMode) => set({ gameMode }),
      setGameType: (gameType) => set({ gameType }),
      setCategories: (categories) => set({ categories }),
      setCategory: (category) => set({ categories: [category] }),
      setDifficulty: (difficulty) => set({ difficulty }),

      setTeams: (teams) => set({ teams }),
      setCurrentTeam: (teamId) => set({ currentTeam: teamId }),

      initializeTeams: (teamCount, names, hintsPerTeam = DEFAULT_HINTS) => {
        const teams = buildTeams(teamCount, names, hintsPerTeam);
        const scores = teams.reduce<Scores>((acc, t) => ({ ...acc, [t.id]: 0 }), {});
        set({ teams, scores, currentTeam: teams[0]?.id ?? 1 });
      },

      renameTeam: (teamId, newName) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? { ...t, name: newName } : t)),
        })),

      updateScore: (teamId, points) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === teamId ? { ...t, score: t.score + points } : t)),
          scores: { ...state.scores, [teamId]: (state.scores[teamId] ?? 0) + points },
        })),

      resetScores: (pointsAwarded) =>
        set((state) => ({
          teams: state.teams.map((t) => ({ ...t, score: pointsAwarded[t.id] ?? 0 })),
          scores: pointsAwarded,
        })),

      consumeHint: (teamId) => {
        const team = get().teams.find((t) => t.id === teamId);
        if (!team || team.hintsRemaining <= 0) return false;
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, hintsRemaining: t.hintsRemaining - 1 } : t
          ),
        }));
        return true;
      },

      nextTurn: () =>
        set((state) => {
          const idx = state.teams.findIndex((t) => t.id === state.currentTeam);
          const next = state.teams[(idx + 1) % state.teams.length];
          return { currentTeam: next?.id ?? state.currentTeam };
        }),

      resetGame: () =>
        set((state) => ({
          teams: buildTeams(state.teams.length),
          scores: {},
          currentTeam: 1,
        })),
    }),
    { name: 'powerletter-game-storage' }
  )
);
