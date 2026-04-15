import { lessonRepository, type AnyLesson } from '../repository';

/**
 * LessonService — orchestrates lesson domain operations.
 */
export class LessonService {
  async findById(id: string): Promise<AnyLesson | null> {
    return lessonRepository.getById(id);
  }

  async listAll(): Promise<AnyLesson[]> {
    return lessonRepository.getAll();
  }

  async listByCategory(category: string): Promise<AnyLesson[]> {
    return lessonRepository.getByCategory(category);
  }

  async search(query: string): Promise<AnyLesson[]> {
    const all = await lessonRepository.getAll();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((l) => l.id.includes(q) || l.title.en.toLowerCase().includes(q));
  }
}

export const lessonService = new LessonService();
