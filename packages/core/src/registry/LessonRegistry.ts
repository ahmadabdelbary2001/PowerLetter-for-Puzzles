import type { LessonCategory } from '@core/store/slices/lessonStore';

export interface LessonEntry {
  id: string;
  category: LessonCategory;
  title: Record<'en' | 'ar', string>;
  description?: Record<'en' | 'ar', string>;
  imageUrl?: string;
  itemCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

type LessonMap = Map<string, LessonEntry>;

/**
 * LessonRegistry — a singleton registry for all available lessons.
 * Lessons are registered at startup and can be queried by id or category.
 */
export class LessonRegistry {
  private static instance: LessonRegistry;
  private lessons: LessonMap = new Map();

  private constructor() {}

  static getInstance(): LessonRegistry {
    if (!LessonRegistry.instance) {
      LessonRegistry.instance = new LessonRegistry();
    }
    return LessonRegistry.instance;
  }

  /** Register one or more lessons. Overwrites if ids collide. */
  register(entries: LessonEntry[]): void {
    for (const entry of entries) {
      this.lessons.set(entry.id, entry);
    }
  }

  /** Look up a single lesson by id. */
  get(id: string): LessonEntry | undefined {
    return this.lessons.get(id);
  }

  /** Return all registered lessons. */
  getAll(): LessonEntry[] {
    return Array.from(this.lessons.values());
  }

  /** Return all lessons for a given category. */
  getByCategory(category: LessonCategory): LessonEntry[] {
    return this.getAll().filter((l) => l.category === category);
  }

  /** Free-text search across both English and Arabic titles. */
  search(query: string): LessonEntry[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAll();
    return this.getAll().filter(
      (l) =>
        l.title.en.toLowerCase().includes(q) ||
        l.title.ar.toLowerCase().includes(q) ||
        l.id.includes(q)
    );
  }

  /** Total number of registered lessons. */
  get size(): number {
    return this.lessons.size;
  }

  /** Clear the registry (useful for testing). */
  clear(): void {
    this.lessons.clear();
  }
}

/** Convenience singleton export */
export const lessonRegistry = LessonRegistry.getInstance();
