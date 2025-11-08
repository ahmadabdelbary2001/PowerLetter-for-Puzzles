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
  // --- The `as any` cast is no longer needed and has been removed. ---
  // The controller is now flexible enough to handle this engine's level type.
  const controller = useGameController<OutsideStoryLevel>({
    engine: outsideStoryGameEngine,
    gameId: 'outsideStory',
  });
  const { gameModeState, t, instructions, handleBack  } = controller;
  const { teams, language, categories, resetScores, setGameMode } = gameModeState;

  const [gameState, setGameState] = useState<GameState>('role_reveal_handoff');
  const [levels, setLevels] = useState<OutsideStoryLevel[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [history, setHistory] = useState<RoundInfo[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<number>(0);
  const [questionPairs, setQuestionPairs] = useState<QuestionPair[]>([]);
  const [votingPlayerIndex, setVotingPlayerIndex] = useState<number>(0);

  const startRound = useCallback((category: string) => {
    const level = levels.find(l => l.category === category);
    if (!level || level.words.length < 8) {
      console.error(t.notEnoughWords ?? 'Not enough words for this category.');
      return;
    }
    if (teams.length < 3) {
      console.error(t.min3Players ?? 'Add at least 3 players.');
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
  }, [levels, teams, t]);

  useEffect(() => {
    let mounted = true;
    setLoadingLevels(true);
    (async () => {
      try {
        const loadedLevels = await outsideStoryGameEngine.loadLevels({ language, categories });
        if (mounted) setLevels(loadedLevels);
      } finally {
        if (mounted) setLoadingLevels(false);
      }
    })();
    return () => { mounted = false; };
  }, [language, categories]);

  useEffect(() => {
    if (loadingLevels || levels.length === 0 || currentRound) return;
    startRound(levels[0].category);
  }, [loadingLevels, levels, currentRound, startRound]);

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
  return {
    players: teams,
    levels,
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
    t,
    instructions,
    handleBack,
  } as const;
}
