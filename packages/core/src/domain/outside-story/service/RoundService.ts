// src/domain/outside-story/service/RoundService.ts
/**
 * @description Service for round management and game logic.
 */

import type { RoundConfig, VoteEntry } from '../model';
import { DEFAULT_WORD_COUNT, POINTS_CORRECT, MIN_PLAYERS } from '../model';

/**
 * Service for managing game rounds
 */
export class RoundService {
  /**
   * Select random words from a word list
   */
  selectWords(words: string[], count: number = DEFAULT_WORD_COUNT): string[] {
    if (words.length <= count) {
      return [...words];
    }

    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Select a secret word (first word in the list)
   */
  selectSecret(words: string[]): string {
    return words[0] ?? '';
  }

  /**
   * Assign outsider randomly
   */
  assignOutsider(playerIds: number[]): number | null {
    if (playerIds.length === 0) return null;
    const index = Math.floor(Math.random() * playerIds.length);
    return playerIds[index];
  }

  /**
   * Create round configuration
   */
  createRoundConfig(
    category: string,
    words: string[],
    playerIds: number[]
  ): RoundConfig | null {
    if (playerIds.length < MIN_PLAYERS) {
      console.warn('[RoundService] Not enough players:', playerIds.length, '<', MIN_PLAYERS);
      return null;
    }

    if (!words || words.length === 0) {
      console.warn('[RoundService] No words provided for category:', category);
      return null;
    }

    const selectedWords = this.selectWords(words);
    const secret = this.selectSecret(selectedWords);
    const outsiderId = this.assignOutsider(playerIds);

    if (!outsiderId) {
      console.warn('[RoundService] Failed to assign outsider');
      return null;
    }

    if (!secret) {
      console.warn('[RoundService] Failed to select secret word');
      return null;
    }

    return {
      category,
      secret,
      words: selectedWords.sort(),
      outsiderId,
      playerIds,
    };
  }

  /**
   * Shuffle players for question order
   */
  shufflePlayers(playerIds: number[]): number[] {
    return [...playerIds].sort(() => Math.random() - 0.5);
  }

  /**
   * Create question pairs (asker -> askee)
   */
  createQuestionPairs(playerIds: number[]): Array<{ asker: number; askee: number }> {
    if (playerIds.length < 2) {
      return [];
    }

    const shuffled = this.shufflePlayers(playerIds);
    const pairs: Array<{ asker: number; askee: number }> = [];

    for (let i = 0; i < shuffled.length; i++) {
      pairs.push({
        asker: shuffled[i],
        askee: shuffled[(i + 1) % shuffled.length],
      });
    }

    return pairs;
  }

  /**
   * Calculate vote tally (excluding outsider)
   */
  calculateTally(votes: VoteEntry[], outsiderId: number): Map<number, number> {
    const tally = new Map<number, number>;

    for (const { voterId, votedForId } of votes) {
      // Outsider doesn't vote in tally
      if (voterId !== outsiderId) {
        tally.set(votedForId, (tally.get(votedForId) || 0) + 1);
      }
    }

    return tally;
  }

  /**
   * Determine who was voted out
   */
  determineVotedPlayer(votes: VoteEntry[], outsiderId: number): number | null {
    const tally = this.calculateTally(votes, outsiderId);

    if (tally.size === 0) {
      return null;
    }

    let maxVotes = 0;
    let votedPlayer: number | null = null;

    for (const [playerId, count] of tally) {
      if (count > maxVotes) {
        maxVotes = count;
        votedPlayer = playerId;
      }
    }

    return votedPlayer;
  }

  /**
   * Check if outsider's guess is correct
   */
  checkOutsiderGuess(guess: string, secret: string): boolean {
    return guess.toLowerCase().trim() === secret.toLowerCase().trim();
  }

  /**
   * Calculate final scores
   */
  calculateScores(
    votes: VoteEntry[],
    outsiderId: number,
    outsiderGuess: string,
    secret: string
  ): Map<number, number> {
    const scores = new Map<number, number>;
    const outsiderGuessedCorrectly = this.checkOutsiderGuess(outsiderGuess, secret);

    // Award points to outsider if guessed correctly
    if (outsiderGuessedCorrectly) {
      scores.set(outsiderId, POINTS_CORRECT);
    }

    // Award points to players who correctly identified the outsider
    for (const { voterId, votedForId } of votes) {
      if (voterId !== outsiderId && votedForId === outsiderId) {
        scores.set(voterId, POINTS_CORRECT);
      }
    }

    return scores;
  }

  /**
   * Check if all players have voted (except outsider)
   */
  allPlayersVoted(votes: VoteEntry[], playerIds: number[], outsiderId: number): boolean {
    const expectedVotes = playerIds.length - 1; // All except outsider
    const actualVotes = votes.filter((v) => v.voterId !== outsiderId).length;
    return actualVotes >= expectedVotes;
  }

  /**
   * Convert Map to Record for JSON serialization
   */
  scoresToRecord(scores: Map<number, number>): Record<number, number> {
    const record: Record<number, number> = {};
    for (const [id, points] of scores) {
      record[id] = points;
    }
    return record;
  }
}

// Singleton instance
export const roundService = new RoundService();
