// src/domain/game/service/OutsideStoryRoundService.ts
/**
 * Service for Outside the Story round management and game logic.
 */

import type { RoundConfig, VoteEntry } from '../model/OutsideStory';
import { DEFAULT_WORD_COUNT, POINTS_CORRECT, MIN_PLAYERS } from '../model/OutsideStory';

export class OutsideStoryRoundService {
  selectWords(words: string[], count: number = DEFAULT_WORD_COUNT): string[] {
    if (words.length <= count) {
      return [...words];
    }
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  selectSecret(words: string[]): string {
    return words[0] ?? '';
  }

  assignOutsider(playerIds: number[]): number | null {
    if (playerIds.length === 0) return null;
    const index = Math.floor(Math.random() * playerIds.length);
    return playerIds[index];
  }

  createRoundConfig(
    category: string,
    words: string[],
    playerIds: number[]
  ): RoundConfig | null {
    if (playerIds.length < MIN_PLAYERS || !words || words.length === 0) {
      return null;
    }

    const selectedWords = this.selectWords(words);
    const secret = this.selectSecret(selectedWords);
    const outsiderId = this.assignOutsider(playerIds);

    if (!outsiderId || !secret) {
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

  shufflePlayers(playerIds: number[]): number[] {
    return [...playerIds].sort(() => Math.random() - 0.5);
  }

  createQuestionPairs(playerIds: number[]): Array<{ asker: number; askee: number }> {
    if (playerIds.length < 2) return [];
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

  calculateTally(votes: VoteEntry[], outsiderId: number): Map<number, number> {
    const tally = new Map<number, number>();
    for (const { voterId, votedForId } of votes) {
      if (voterId !== outsiderId) {
        tally.set(votedForId, (tally.get(votedForId) || 0) + 1);
      }
    }
    return tally;
  }

  determineVotedPlayer(votes: VoteEntry[], outsiderId: number): number | null {
    const tally = this.calculateTally(votes, outsiderId);
    if (tally.size === 0) return null;

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

  checkOutsiderGuess(guess: string, secret: string): boolean {
    return guess.toLowerCase().trim() === secret.toLowerCase().trim();
  }

  calculateScores(
    votes: VoteEntry[],
    outsiderId: number,
    outsiderGuess: string,
    secret: string
  ): Map<number, number> {
    const scores = new Map<number, number>();
    const outsiderGuessedCorrectly = this.checkOutsiderGuess(outsiderGuess, secret);

    if (outsiderGuessedCorrectly) {
      scores.set(outsiderId, POINTS_CORRECT);
    }

    for (const { voterId, votedForId } of votes) {
      if (voterId !== outsiderId && votedForId === outsiderId) {
        scores.set(voterId, POINTS_CORRECT);
      }
    }
    return scores;
  }

  allPlayersVoted(votes: VoteEntry[], playerIds: number[], outsiderId: number): boolean {
    const expectedVotes = playerIds.length - 1;
    const actualVotes = votes.filter((v) => v.voterId !== outsiderId).length;
    return actualVotes >= expectedVotes;
  }

  scoresToRecord(scores: Map<number, number>): Record<number, number> {
    const record: Record<number, number> = {};
    for (const [id, points] of scores) {
      record[id] = points;
    }
    return record;
  }
}

export const outsideStoryRoundService = new OutsideStoryRoundService();
