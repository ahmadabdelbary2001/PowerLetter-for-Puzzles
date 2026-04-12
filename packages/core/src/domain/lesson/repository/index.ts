import type { AnimalLesson } from '../model/AnimalLesson';
import type { CountryLesson } from '../model/CountryLesson';
import type { VocabularyLesson } from '../model/VocabularyLesson';

export type AnyLesson = AnimalLesson | CountryLesson | VocabularyLesson;

export interface LessonRepository {
  getById(id: string): Promise<AnyLesson | null>;
  getAll(): Promise<AnyLesson[]>;
  getByCategory(category: string): Promise<AnyLesson[]>;
}

/**
 * StaticLessonRepository — loads lessons from bundled JSON data files.
 * Replace with an API-backed implementation when a backend is available.
 */
export class StaticLessonRepository implements LessonRepository {
  async getById(id: string): Promise<AnyLesson | null> {
    const all = await this.getAll();
    return all.find((l) => l.id === id) ?? null;
  }

  async getAll(): Promise<AnyLesson[]> {
    // TODO: dynamically import from data/lessons/
    return [];
  }

  async getByCategory(category: string): Promise<AnyLesson[]> {
    const all = await this.getAll();
    return all.filter((l) => l.type === category);
  }
}

export const lessonRepository = new StaticLessonRepository();
