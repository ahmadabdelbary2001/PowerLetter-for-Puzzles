import type { GameMetadata, GameType } from '@core/types/game';
import type { LessonEntry } from './LessonRegistry';

export interface RecommendationOptions {
  recentGameIds?: GameType[];
  recentLessonIds?: string[];
  preferredCategories?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  maxResults?: number;
}

export interface RecommendationResult<T> {
  item: T;
  score: number;
  reason: 'preferred_category' | 'same_difficulty' | 'not_yet_played' | 'trending';
}

/**
 * RecommendationEngine — scores and ranks games/lessons based on
 * user history and preferences.  Pure functions, no side-effects.
 */
export class RecommendationEngine {
  private static readonly DEFAULT_MAX = 6;

  /**
   * Recommend games from the full registry based on user context.
   */
  static recommendGames(
    allGames: GameMetadata[],
    options: RecommendationOptions
  ): RecommendationResult<GameMetadata>[] {
    const {
      recentGameIds = [],
      preferredCategories = [],
      difficulty,
      maxResults = this.DEFAULT_MAX,
    } = options;

    const scored = allGames.map((game) => {
      let score = 0;
      const reason: RecommendationResult<GameMetadata>['reason'] = 'not_yet_played';

      // Bonus for not yet played
      if (!recentGameIds.includes(game.id)) score += 10;

      // Bonus for preferred category overlap
      if (
        preferredCategories.length > 0 &&
        game.availableCategories?.some((c) => preferredCategories.includes(c))
      ) {
        score += 8;
      }

      return { item: game, score, reason } satisfies RecommendationResult<GameMetadata>;
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  /**
   * Recommend lessons based on user history and progress.
   */
  static recommendLessons(
    allLessons: LessonEntry[],
    options: RecommendationOptions
  ): RecommendationResult<LessonEntry>[] {
    const {
      recentLessonIds = [],
      preferredCategories = [],
      difficulty,
      maxResults = this.DEFAULT_MAX,
    } = options;

    const scored = allLessons.map((lesson) => {
      let score = 0;
      let reason: RecommendationResult<LessonEntry>['reason'] = 'not_yet_played';

      if (!recentLessonIds.includes(lesson.id)) score += 10;

      if (preferredCategories.includes(lesson.category)) {
        score += 8;
        reason = 'preferred_category';
      }

      if (difficulty && lesson.difficulty === difficulty) {
        score += 5;
        reason = 'same_difficulty';
      }

      return { item: lesson, score, reason } satisfies RecommendationResult<LessonEntry>;
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
}
