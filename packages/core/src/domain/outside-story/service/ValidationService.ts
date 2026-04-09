// src/domain/outside-story/service/ValidationService.ts
/**
 * @description Service for validating game state and levels.
 */

import type { OutsiderLevel } from '../model';
import { MIN_PLAYERS, DEFAULT_WORD_COUNT } from '../model';

/**
 * Service for validation logic
 */
export class ValidationService {
  /**
   * Check if level has enough words for a round
   */
  hasEnoughWords(level: OutsiderLevel, minCount: number = DEFAULT_WORD_COUNT): boolean {
    return level.words && level.words.length >= minCount;
  }

  /**
   * Validate minimum players requirement
   */
  hasEnoughPlayers(playerCount: number): boolean {
    return playerCount >= MIN_PLAYERS;
  }

  /**
   * Validate a level is playable
   */
  isLevelValid(level: OutsiderLevel): boolean {
    return (
      level.id !== 'error' &&
      level.words &&
      level.words.length > 0 &&
      this.hasEnoughWords(level)
    );
  }

  /**
   * Validate level for starting a round
   */
  canStartRound(
    level: OutsiderLevel,
    playerCount: number
  ): { valid: boolean; reason?: string } {
    if (!this.hasEnoughWords(level)) {
      return {
        valid: false,
        reason: 'notEnoughWords',
      };
    }

    if (!this.hasEnoughPlayers(playerCount)) {
      return {
        valid: false,
        reason: 'min3Players',
      };
    }

    return { valid: true };
  }
}

// Singleton instance
export const validationService = new ValidationService();
