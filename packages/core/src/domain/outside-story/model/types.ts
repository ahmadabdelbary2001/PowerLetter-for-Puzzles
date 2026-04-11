// src/domain/outside-story/model/types.ts
/**
 * @description Core domain types for Outside the Story game following FSD architecture.
 */

import type { Language, GameCategory, GameLevel } from '@/types/game';

/**
 * Represents a level/category in the Outside the Story game
 */
export interface OutsiderLevel extends GameLevel {
  id: string;
  language: Language;
  category: GameCategory;
  words: string[];
  solution: string;
  meta?: Record<string, unknown>;
}

/**
 * Player role in the game
 */
export type PlayerRole = 'insider' | 'outsider';

/**
 * Configuration for a game round
 */
export interface RoundConfig {
  category: string;
  secret: string;
  words: string[];
  outsiderId: number;
  playerIds: number[];
}

/**
 * Vote record entry
 */
export interface VoteEntry {
  voterId: number;
  votedForId: number;
}

/**
 * Round result after voting
 */
export interface RoundResult {
  votedPlayerId?: number;
  outsiderGuessedCorrectly?: boolean;
  pointsAwarded: Record<number, number>;
}

/**
 * Round information for UI state
 */
export interface RoundInfo {
  id: string;
  category: string;
  secret: string;
  words: string[];
  outsiderId: number;
  insiders: number[];
  votes: Record<number, number>;
  revealed: boolean;
  roundResult?: RoundResult;
}

/**
 * Question pair for turns
 */
export interface QuestionPair {
  asker: { id: number; name: string; color: string };
  askee: { id: number; name: string; color: string };
}

/**
 * Game state machine states
 */
export type GameState =
  | 'role_reveal_handoff'
  | 'role_reveal_player'
  | 'question_intro'
  | 'question_turn'
  | 'voting'
  | 'outsider_guess'
  | 'results'
  | 'round_end';

/**
 * Level data from JSON file
 */
export interface OutsiderLevelData {
  words: string[];
  meta?: Record<string, unknown>;
}
