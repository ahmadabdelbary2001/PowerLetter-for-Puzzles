import { userRepository } from '../repository';
import type { User, UserPreferences } from '../model';

export class UserService {
  async getCurrent(): Promise<User | null> {
    return userRepository.getCurrent();
  }

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<void> {
    const user = await userRepository.getCurrent();
    if (!user) return;
    await userRepository.save({
      ...user,
      preferences: { ...user.preferences, ...prefs },
    });
  }

  async incrementStat(
    stat: 'totalGamesPlayed' | 'totalLessonsCompleted' | 'totalPathsCompleted'
  ): Promise<void> {
    const user = await userRepository.getCurrent();
    if (!user) return;
    await userRepository.save({
      ...user,
      stats: { ...user.stats, [stat]: (user.stats[stat] ?? 0) + 1 },
    });
  }

  async signOut(): Promise<void> {
    await userRepository.clear();
  }
}

export const userService = new UserService();
