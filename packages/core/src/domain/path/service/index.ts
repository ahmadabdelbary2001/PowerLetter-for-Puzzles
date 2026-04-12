import { pathRepository } from '../repository';
import type { LearningPath } from '../model';

export class PathService {
  async findById(id: string): Promise<LearningPath | null> {
    return pathRepository.getById(id);
  }

  async listAll(): Promise<LearningPath[]> {
    return pathRepository.getAll();
  }

  /** Calculate overall progress for a path given a set of completed step ids. */
  calculateProgress(path: LearningPath, completedStepIds: Set<string>): number {
    if (path.steps.length === 0) return 0;
    const done = path.steps.filter((s) => completedStepIds.has(s.id)).length;
    return Math.round((done / path.steps.length) * 100);
  }

  /** Unlock the next step after a given step id. Returns the updated path. */
  unlockNextStep(path: LearningPath, completedStepId: string): LearningPath {
    const idx = path.steps.findIndex((s) => s.id === completedStepId);
    if (idx === -1 || idx + 1 >= path.steps.length) return path;
    const steps = path.steps.map((s, i) =>
      i === idx + 1 ? { ...s, isUnlocked: true } : s
    );
    return { ...path, steps };
  }
}

export const pathService = new PathService();
