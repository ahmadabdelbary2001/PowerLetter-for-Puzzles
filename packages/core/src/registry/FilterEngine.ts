import type { GameType, GameCategory, Difficulty, GameMetadata, GAME_METADATA } from '@core/types/game';

export interface FilterCriteria {
  type?: 'adult' | 'kids' | 'all';
  categories?: GameCategory[];
  difficulty?: Difficulty;
  supportedSettings?: Array<'teams' | 'difficulty' | 'category'>;
}

/**
 * FilterEngine — stateless utility for filtering game/lesson collections
 * by type, category, difficulty, and supported settings.
 */
export class FilterEngine {
  /**
   * Filter a list of GameMetadata by the given criteria.
   */
  static filterGames(
    games: GameMetadata[],
    criteria: FilterCriteria
  ): GameMetadata[] {
    return games.filter((game) => {
      // Type filter
      if (criteria.type && criteria.type !== 'all') {
        if (game.type !== criteria.type) return false;
      }

      // Category filter — game must support at least one requested category
      if (criteria.categories && criteria.categories.length > 0) {
        if (!game.availableCategories) return false;
        const hasCategory = criteria.categories.some((cat) =>
          game.availableCategories!.includes(cat)
        );
        if (!hasCategory) return false;
      }

      // Supported settings filter
      if (criteria.supportedSettings && criteria.supportedSettings.length > 0) {
        const hasAllSettings = criteria.supportedSettings.every((setting) =>
          game.supportedSettings.includes(setting)
        );
        if (!hasAllSettings) return false;
      }

      return true;
    });
  }

  /**
   * Filter by a free-text search query matching against a title map.
   */
  static filterByQuery<T extends { id: string }>(
    items: T[],
    query: string,
    titleMap: Record<string, string>
  ): T[] {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const title = (titleMap[item.id] ?? '').toLowerCase();
      return title.includes(q) || item.id.includes(q);
    });
  }

  /**
   * Sort items by relevance score (higher first).
   */
  static sortByRelevance<T extends { relevance?: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => (b.relevance ?? 0) - (a.relevance ?? 0));
  }
}
