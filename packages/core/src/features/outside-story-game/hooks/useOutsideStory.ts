// src/features/outside-story-game/hooks/useOutsideStory.ts
/**
 * @description The single, all-in-one hook for the Outside Story game.
 */
import { useCallback, useEffect, useState } from 'react';
import { useGameController } from '@core/hooks/game/useGameController';
import { outsideStoryGameEngine } from '../engine';
import type { Team } from '@core/types/game';

// Import domain services
import {
  outsideStoryRoundService as roundService,
  outsideStoryValidationService as validationService,
  type OutsiderLevel,
  type GameState,
  type RoundInfo,
} from '@core/domain/game';

// Re-export types for backward compatibility
export type { GameState, RoundInfo, OutsiderLevel as OutsideStoryLevel } from '@core/domain/game';
export type QuestionPair = { asker: Team; askee: Team; };

export function useOutsideStory() {
  // --- 1. CONTROLLER LAYER ---
  const controller = useGameController<OutsiderLevel>({
    engine: outsideStoryGameEngine,
    gameId: 'outsideStory',
  });

  const {
    levels: loadedLevels,
    loading: loadingLevels,
    gameModeState,
    setNotification,
    handleBackWith,
  } = controller;

  const { teams, resetScores, setGameMode } = gameModeState;

  const [gameState, setGameState] = useState<GameState>('role_reveal_handoff');
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [history, setHistory] = useState<RoundInfo[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<number>(0);
  const [questionPairs, setQuestionPairs] = useState<QuestionPair[]>([]);
  const [votingPlayerIndex, setVotingPlayerIndex] = useState<number>(0);

  const startRound = useCallback((category: string) => {
    const level = loadedLevels.find((l: any) => l.category === category);
    if (!level) {
      console.warn('[useOutsideStory] Level not found for category:', category);
      setNotification({ messageKey: 'categoryNotFound', type: 'error' });
      return;
    }

    if (!level.words || level.words.length === 0) {
      console.warn('[useOutsideStory] Level has no words:', category, level);
      setNotification({ messageKey: 'categoryNotFound', type: 'error' });
      return;
    }

    const validation = validationService.canStartRound(level, teams.length);
    if (!validation.valid) {
      console.warn('[useOutsideStory] Validation failed:', validation.reason);
      setNotification({ messageKey: validation.reason ?? 'unknownError', type: 'error' });
      return;
    }

    const playerIds = teams.map((p: any) => p.id);
    const roundConfig = roundService.createRoundConfig(category, level.words, playerIds);

    if (!roundConfig) {
      setNotification({ messageKey: 'failedToStartRound', type: 'error' });
      return;
    }

    const round: RoundInfo = {
      id: `${Date.now()}`,
      category: roundConfig.category,
      secret: roundConfig.secret,
      words: roundConfig.words,
      outsiderId: roundConfig.outsiderId,
      insiders: playerIds.filter((id: any) => id !== roundConfig.outsiderId),
      votes: {},
      revealed: false,
    };

    setCurrentRound(round);
    setCurrentPlayerTurn(0);
    setGameState('role_reveal_handoff');
  }, [loadedLevels, teams, setNotification]);

  useEffect(() => {
    if (loadingLevels || loadedLevels.length === 0 || currentRound) return;
    startRound(loadedLevels[0].category);
  }, [loadingLevels, loadedLevels, currentRound, startRound]);

  const setupQuestionTurns = useCallback(() => {
    if (teams.length < 2) return;
    const playerIds = teams.map((p: any) => p.id);
    const pairs = roundService.createQuestionPairs(playerIds);
    const teamMap = new Map(teams.map((t: any) => [t.id, t]));
    const questionPairs: QuestionPair[] = pairs.map(({ asker, askee }: any) => ({
      asker: teamMap.get(asker)!,
      askee: teamMap.get(askee)!,
    }));

    setQuestionPairs(questionPairs);
    setCurrentPlayerTurn(0);
    setGameState('question_turn');
  }, [teams]);

  const finishVoting = useCallback(() => {
    if (!currentRound) return;
    const voteEntries = Object.entries(currentRound.votes).map(([voterId, votedForId]) => ({
      voterId: parseInt(voterId, 10),
      votedForId,
    }));
    const votedPlayerId = roundService.determineVotedPlayer(voteEntries, currentRound.outsiderId);
    setCurrentRound((prev: any) => prev ? { ...prev, roundResult: { votedPlayerId: votedPlayerId ?? undefined, pointsAwarded: {} } } : null);
    setGameState('outsider_guess');
  }, [currentRound]);

  const handleOutsiderGuess = useCallback((guess: string) => {
    if (!currentRound) return;
    const voteEntries = Object.entries(currentRound.votes).map(([voterId, votedForId]) => ({
      voterId: parseInt(voterId, 10),
      votedForId,
    }));
    const scores = roundService.calculateScores(voteEntries, currentRound.outsiderId, guess, currentRound.secret);
    const pointsAwarded = roundService.scoresToRecord(scores);
    const outsiderGuessedCorrectly = roundService.checkOutsiderGuess(guess, currentRound.secret);

    resetScores(pointsAwarded);
    const finalRound: RoundInfo = {
      ...currentRound,
      revealed: true,
      roundResult: {
        ...currentRound.roundResult,
        outsiderGuessedCorrectly,
        pointsAwarded,
      }
    };
    setCurrentRound(finalRound);
    setHistory(prev => [finalRound, ...prev]);
    setGameState('results');
  }, [currentRound, teams, resetScores]);

  const nextTurn = () => setCurrentPlayerTurn(prev => prev + 1);
  const nextVoter = () => setVotingPlayerIndex(prev => prev + 1);
  const playAgain = useCallback(() => {
    setCurrentPlayerTurn(0);
    setVotingPlayerIndex(0);
    setCurrentRound(null);
  }, []);
  const changePlayersAndReset = useCallback(() => {
    setGameMode('competitive');
    resetScores({});
  }, [setGameMode, resetScores]);

  return {
    ...controller,
    handleBackWith,
    players: teams,
    levels: loadedLevels,
    loadingLevels,
    currentRound,
    history,
    startRound,
    playAgain,
    changePlayersAndReset,
    gameState,
    setGameState,
    currentPlayerTurn,
    nextTurn,
    finishVoting,
    handleOutsiderGuess,
    setupQuestionTurns,
    questionPairs,
    submitVote: (voterId: number, votedPlayerId: number) => {
      setCurrentRound((prev: any) => prev ? { ...prev, votes: { ...prev.votes, [voterId]: votedPlayerId } } : null);
    },
    votingPlayerIndex,
    nextVoter,
  } as const;
}
