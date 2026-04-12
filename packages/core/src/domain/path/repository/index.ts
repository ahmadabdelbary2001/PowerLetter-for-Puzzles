import type { LearningPath } from '../model';

export interface PathRepository {
  getById(id: string): Promise<LearningPath | null>;
  getAll(): Promise<LearningPath[]>;
}

export class StaticPathRepository implements PathRepository {
  async getById(id: string): Promise<LearningPath | null> {
    const all = await this.getAll();
    return all.find((p) => p.id === id) ?? null;
  }

  async getAll(): Promise<LearningPath[]> {
    // TODO: load from data/paths/ or API
    return [];
  }
}

export const pathRepository = new StaticPathRepository();
