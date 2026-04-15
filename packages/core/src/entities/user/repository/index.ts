import type { User } from '../model';

export interface UserRepository {
  getCurrent(): Promise<User | null>;
  save(user: User): Promise<void>;
  clear(): Promise<void>;
}

/** LocalUserRepository — persists user to localStorage. */
export class LocalUserRepository implements UserRepository {
  private readonly KEY = 'powerletter-user';

  async getCurrent(): Promise<User | null> {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(this.KEY) : null;
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  async save(user: User): Promise<void> {
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.KEY);
  }
}

export const userRepository = new LocalUserRepository();
