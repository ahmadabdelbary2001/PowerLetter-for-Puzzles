// src/features/outside-story-game/hooks/useOutsideStory.ts
import { useCallback, useEffect, useState } from 'react';
import { outsideStoryGameEngine, type OutsideStoryLevel } from '@/features/outside-story-game/engine';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import type { Team } from '@/types/game';

export type GameState =
  | 'role_reveal_handoff'
  | 'role_reveal_player'
  | 'question_intro'
  | 'question_turn'
  | 'voting'
  | 'outsider_guess'
  | 'results'
  | 'round_end';

export type QuestionPair = {
  asker: Team;
  askee: Team;
};

export type RoundInfo = {
  id: string;
  category: string;
  secret: string;
  words: string[];
  outsiderId: number;
  insiders: number[];
  votes: Record<number, number>;
  revealed: boolean;
  roundResult?: {
    votedPlayerId?: number;
    outsiderGuessedCorrectly?: boolean;
    pointsAwarded: Record<number, number>;
  };
};

export function useOutsideStory() {
  const { teams, language: appLanguage, categories, resetScores, setGameMode } = useGameMode();
  const { t } = useTranslation();

  const [gameState, setGameState] = useState<GameState>('role_reveal_handoff');
  const [levels, setLevels] = useState<OutsideStoryLevel[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [currentRound, setCurrentRound] = useState<RoundInfo | null>(null);
  const [history, setHistory] = useState<RoundInfo[]>([]);
  const [currentPlayerTurn, setCurrentPlayerTurn] = useState<number>(0);
  const [questionPairs, setQuestionPairs] = useState<QuestionPair[]>([]);
  // Add state to track the current voter
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
      id: `${Date.now()}`,
      category,
      secret,
      words: roundWords.sort(),
      outsiderId,
      insiders,
      votes: {},
      revealed: false,
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
        const loadedLevels = await outsideStoryGameEngine.loadLevels({
          language: (appLanguage ?? 'ar'),
          categories: categories,
        });
        if (mounted) {
          setLevels(loadedLevels);
        }
      } finally {
        if (mounted) {
          setLoadingLevels(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [appLanguage, categories]);

  useEffect(() => {
    if (loadingLevels || levels.length === 0 || currentRound) {
      return;
    }
    startRound(levels[0].category);
  }, [loadingLevels, levels, currentRound, startRound]);

  // Implemented a fair pairing algorithm
  const setupQuestionTurns = useCallback(() => {
    if (teams.length < 2) return;

    const shuffledPlayers = [...teams].sort(() => Math.random() - 0.5);
    const pairs: QuestionPair[] = [];

    for (let i = 0; i < shuffledPlayers.length; i++) {
      const asker = shuffledPlayers[i];
      // The askee is the next person in the shuffled list, wrapping around at the end
      const askee = shuffledPlayers[(i + 1) % shuffledPlayers.length];
      pairs.push({ asker, askee });
    }

    setQuestionPairs(pairs);
    setCurrentPlayerTurn(0);
    setGameState('question_turn');
  }, [teams]);


  const finishVoting = useCallback(() => {
    if (!currentRound) return;

    const tally: Record<number, number> = {};
    for (const voterId in currentRound.votes) {
      const voter = parseInt(voterId, 10);
      if (voter !== currentRound.outsiderId) {
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

    const completedRound = { ...currentRound, revealed: true, roundResult: { votedPlayerId, pointsAwarded: {} } };
    setCurrentRound(completedRound);

    if (votedPlayerId === currentRound.outsiderId) {
      setGameState('outsider_guess');
    } else {
      const pointsAwarded: Record<number, number> = {};
      teams.forEach(p => pointsAwarded[p.id] = 0);
      pointsAwarded[currentRound.outsiderId] = 100;

      resetScores(pointsAwarded);
      const finalRound = { ...completedRound, roundResult: { ...completedRound.roundResult, outsiderGuessedCorrectly: false, pointsAwarded } };
      setCurrentRound(finalRound);
      setHistory(prev => [finalRound, ...prev]);
      setGameState('results');
    }
  }, [currentRound, teams, resetScores]);

  const handleOutsiderGuess = useCallback((guess: string) => {
    if (!currentRound || !currentRound.roundResult) return;

    const correctGuess = guess === currentRound.secret;
    const pointsAwarded: Record<number, number> = {};
    teams.forEach(p => pointsAwarded[p.id] = 0);

    if (correctGuess) {
      pointsAwarded[currentRound.outsiderId] = 100;
    } else {
      currentRound.insiders.forEach(id => { pointsAwarded[id] = 100; });
    }

    resetScores(pointsAwarded);
    const finalRound = { ...currentRound, roundResult: { ...currentRound.roundResult, outsiderGuessedCorrectly: correctGuess, pointsAwarded } };
    setCurrentRound(finalRound);
    setHistory(prev => [finalRound, ...prev]);
    setGameState('results');
  }, [currentRound, teams, resetScores]);

  const nextTurn = () => {
    setCurrentPlayerTurn(prev => (prev + 1));
  };

  // Add a function to advance to the next voter
  const nextVoter = () => {
    setVotingPlayerIndex(prev => prev + 1);
  };

  const playAgain = useCallback(() => {
    setCurrentPlayerTurn(0);
    setVotingPlayerIndex(0); // Reset voter index for the new round
    setCurrentRound(null);
  }, []);

  const changePlayersAndReset = useCallback(() => {
    setGameMode('competitive');
    resetScores({});
  }, [setGameMode, resetScores]);

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
    // Expose voter state and functions
    votingPlayerIndex,
    nextVoter,
    t,
  } as const;
}
