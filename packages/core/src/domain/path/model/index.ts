// Learning path domain model

export type StepType = 'lesson' | 'game' | 'quiz';

export interface PathStep {
  id: string;
  type: StepType;
  referenceId: string;
  title: Record<'en' | 'ar', string>;
  isCompleted: boolean;
  isUnlocked: boolean;
  prerequisiteStepId?: string;
}

export interface LearningPath {
  id: string;
  title: Record<'en' | 'ar', string>;
  description: Record<'en' | 'ar', string>;
  coverImageUrl?: string;
  estimatedMinutes?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: PathStep[];
  createdAt: string;
  updatedAt: string;
}
