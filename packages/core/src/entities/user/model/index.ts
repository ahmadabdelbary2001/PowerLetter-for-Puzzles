// User domain model
import type { Language } from '@core/shared/types/game';

export interface UserPreferences {
  language: Language;
  notifications: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalLessonsCompleted: number;
  totalPathsCompleted: number;
  streakDays: number;
  lastActiveAt: string;
}

export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  email?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en',
  notifications: true,
  soundEnabled: true,
  hapticEnabled: true,
};
