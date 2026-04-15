import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@core/shared/types/game';

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

interface UserState {
  profile: UserProfile | null;
  preferredLanguage: Language;
  hasCompletedOnboarding: boolean;
  totalGamesPlayed: number;
  totalLessonsCompleted: number;

  setProfile: (profile: UserProfile | null) => void;
  setPreferredLanguage: (lang: Language) => void;
  completeOnboarding: () => void;
  incrementGamesPlayed: () => void;
  incrementLessonsCompleted: () => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      preferredLanguage: 'en',
      hasCompletedOnboarding: false,
      totalGamesPlayed: 0,
      totalLessonsCompleted: 0,

      setProfile: (profile) => set({ profile }),
      setPreferredLanguage: (preferredLanguage) => set({ preferredLanguage }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      incrementGamesPlayed: () =>
        set((state) => ({ totalGamesPlayed: state.totalGamesPlayed + 1 })),
      incrementLessonsCompleted: () =>
        set((state) => ({ totalLessonsCompleted: state.totalLessonsCompleted + 1 })),
      resetUser: () =>
        set({
          profile: null,
          hasCompletedOnboarding: false,
          totalGamesPlayed: 0,
          totalLessonsCompleted: 0,
        }),
    }),
    { name: 'powerletter-user-storage' }
  )
);
