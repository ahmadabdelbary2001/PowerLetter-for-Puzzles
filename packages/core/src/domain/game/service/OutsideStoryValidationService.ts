// src/domain/game/service/OutsideStoryValidationService.ts
/**
 * Service for validating Outside the Story game state and levels.
 */

import type { OutsiderLevel } from '../model/OutsideStory';
import { MIN_PLAYERS, DEFAULT_WORD_COUNT } from '../model/OutsideStory';

export class OutsideStoryValidationService {
  hasEnoughWords(level: OutsiderLevel, minCount: number = DEFAULT_WORD_COUNT): boolean {
    return level.words && level.words.length >= minCount;
  }

  hasEnoughPlayers(playerCount: number): boolean {
    return playerCount >= MIN_PLAYERS;
  }

  isLevelValid(level: OutsiderLevel): boolean {
    return (
      level.id !== 'error' &&
      level.words &&
      level.words.length > 0 &&
      this.hasEnoughWords(level)
    );
  }

  canStartRound(
    level: OutsiderLevel,
    playerCount: number
  ): { valid: boolean; reason?: string } {
    if (!this.hasEnoughWords(level)) {
      return { valid: false, reason: 'notEnoughWords' };
    }
    if (!this.hasEnoughPlayers(playerCount)) {
      return { valid: false, reason: 'min3Players' };
    }
    return { valid: true };
  }
}

export const outsideStoryValidationService = new OutsideStoryValidationService();
