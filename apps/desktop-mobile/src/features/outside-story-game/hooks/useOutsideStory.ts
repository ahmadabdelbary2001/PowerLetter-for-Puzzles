// src/features/outside-story-game/hooks/useOutsideStoryGame.ts
/**
 * @description The single, all-in-one hook for the Outside Story game.
 * --- It now follows the standard architectural pattern. ---
 * It uses the `useGameController` to fetch global state and content,
 * and then implements the unique round-based logic for this game.
 */
import { useCallback, useEffect, useState } from 'react';
import { useGameController } from '@/hooks/game/useGameController';
import { outsideStoryGameEngine, type OutsideStoryLevel } from '@/features/outside-story-game/engine';
import type { Team } from '@/types/game';

// Type definitions for the game's internal state
export type GameState =
  | 'role_reveal_handoff' | 'role_reveal_player' | 'question_intro' | 'question_turn'
  | 'voting' | 'outsider_guess' | 'results' | 'round_end';

export type QuestionPair = { asker: Team; askee: Team; };

export type RoundInfo = {
  id: string; category: string; secret: string; words: string[];
  outsiderId: number; insiders: number[]; votes: Record<number, number>;
  revealed: boolean;
  roundResult?: {
    votedPlayerId?: number;
    outsiderGuessedCorrectly?: boolean;
    pointsAwarded: Record<number, number>;
  };
};

export function useOutsideStory() {
  // --- 1. CONTROLLER LAYER ---
  // --- Use the central game controller ---
  const controller = useGameController<OutsideStoryLevel>({
    engine: outsideStoryGameEngine,
    gameId: 'outsideStory',
  });

  // --- Destructure everything from the controller ---
  const {
    levels: loadedLevels, // Rename to avoid conflict
    loading: loadingLevels, // Rename to avoid conflict
    gameModeState,
    setNotification, // Get the setter for local notifications
  } = controller;

  const { teams, resetScores, setGameMode } = gameModeState;

  const [gameState, setGameState] = useState<GameState>('role_reveal_handoff');
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [history, setHistory] = useState<RoundInfo[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<number>(0);
  const [questionPairs, setQuestionPairs] = useState<QuestionPair[]>([]);
  const [votingPlayerIndex, setVotingPlayerIndex] = useState<number>(0);

  const startRound = useCallback((category: string) => {
    const level = loadedLevels.find(l => l.category === category);
    if (!level || level.words.length < 8) {
      setNotification({ messageKey: 'notEnoughWords', type: 'error' });
      return;
    }
    if (teams.length < 3) {
      setNotification({ messageKey: 'min3Players', type: 'error' });
      return;
    }
    const shuffled = [...level.words].sort(() => 0.5 - Math.random());
    const roundWords = shuffled.slice(0, 8);
    const secret = roundWords[0];
    const outsiderIndex = Math.floor(Math.random() * teams.length);
    const outsiderId = teams[outsiderIndex].id;
    const insiders = teams.map(p => p.id).filter(id => id !== outsiderId);
    const round: RoundInfo = {
      id: `${Date.now()}`, category, secret, words: roundWords.sort(),
      outsiderId, insiders, votes: {}, revealed: false,
    };
    setCurrentRound(round);
    setCurrentPlayerTurn(0);
    setGameState('role_reveal_handoff');
  }, [loadedLevels, teams, setNotification]);

  // --- The local useEffect for loading levels is no longer needed. ---
  // The useGameController handles this automatically.

  useEffect(() => {
    if (loadingLevels || loadedLevels.length === 0 || currentRound) return;
    startRound(loadedLevels[0].category);
  }, [loadingLevels, loadedLevels, currentRound, startRound]);

  const setupQuestionTurns = useCallback(() => {
    if (teams.length < 2) return;
    const shuffledPlayers = [...teams].sort(() => Math.random() - 0.5);
    const pairs: QuestionPair[] = [];
    for (let i = 0; i < shuffledPlayers.length; i++) {
      pairs.push({ asker: shuffledPlayers[i], askee: shuffledPlayers[(i + 1) % shuffledPlayers.length] });
    }
    setQuestionPairs(pairs);
    setCurrentPlayerTurn(0);
    setGameState('question_turn');
  }, [teams]);

  const finishVoting = useCallback(() => {
    if (!currentRound) return;
    const tally: Record<number, number> = {};
    for (const voterId in currentRound.votes) {
      if (parseInt(voterId, 10) !== currentRound.outsiderId) {
        const votedForId = currentRound.votes[voterId];
        tally[votedForId] = (tally[votedForId] || 0) + 1;
      }
    }
    let maxVotes = 0;
    let votedPlayerId = -1;
    for (const playerId in tally) {
      if (tally[playerId] > maxVotes) {
        maxVotes = tally[playerId];
        votedPlayerId = parseInt(playerId, 10);
      }
    }
    setCurrentRound(prev => prev ? { ...prev, roundResult: { votedPlayerId, pointsAwarded: {} } } : null);
    setGameState('outsider_guess');
  }, [currentRound]);

  const handleOutsiderGuess = useCallback((guess: string) => {
    if (!currentRound) return;
    const outsiderGuessedCorrectly = guess === currentRound.secret;
    const pointsAwarded: Record<number, number> = {};
    teams.forEach(p => pointsAwarded[p.id] = 0);
    if (outsiderGuessedCorrectly) {
      pointsAwarded[currentRound.outsiderId] = 10;
    }
    for (const voterId in currentRound.votes) {
      if (parseInt(voterId, 10) !== currentRound.outsiderId && currentRound.votes[voterId] === currentRound.outsiderId) {
        pointsAwarded[parseInt(voterId, 10)] = (pointsAwarded[parseInt(voterId, 10)] || 0) + 10;
      }
    }
    resetScores(pointsAwarded);
    const finalRound = {
      ...currentRound, revealed: true,
      roundResult: { ...currentRound.roundResult, outsiderGuessedCorrectly, pointsAwarded }
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

  // --- 3. RETURN THE FINAL OBJECT FOR THE UI ---
  // --- Return the properties from the controller ---
  return {
    ...controller, // Spread the controller to include notification, onClearNotification, etc.
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
      setCurrentRound(prev => prev ? { ...prev, votes: { ...prev.votes, [voterId]: votedPlayerId } } : null);
    },
    votingPlayerIndex,
    nextVoter,
  } as const;
}
