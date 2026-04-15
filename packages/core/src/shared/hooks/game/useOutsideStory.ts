"use client";

// src/hooks/game/useOutsideStory.ts
/**
 * @description The main logic hook for the "Outside the Story" game.
 * Refactored to mirror the legacy round lifecycle:
 * role reveal -> question intro -> question turns -> voting -> outsider guess -> results -> round_end
 *
 * Key fixes:
 * - Robust `playAgain` that fully resets local round state and safely advances to next level.
 * - Correct vote aggregation by voter -> voted player mapping.
 * - Stable voting progression with explicit `votingPlayerIndex`.
 * - Deterministic transitions without stale closure issues.
 */
import { useState, useCallback, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import type {
  OutsiderLevel,
  GameState,
  QuestionPair,
  RoundInfo,
} from "@core/entities/model/OutsideStory";
import {
  MIN_PLAYERS,
  DEFAULT_WORD_COUNT,
  POINTS_CORRECT,
} from "@core/entities/model/OutsideStory";
import { outsideStoryGameEngine as engine } from "@core/features/games/engine/outside-story-gameEngine";
import { useGameController } from "@core/shared/hooks/game/useGameController";
import { shuffleArray } from "@core/shared/lib/gameUtils";

export function useOutsideStory() {
  // 1) Shared controller
  const controller = useGameController<OutsiderLevel>({
    engine,
    gameId: "outsideStory",
  });

  const { currentLevel, levels, gameModeState } = controller;
  const { teams, updateScore } = gameModeState;

  // 2) Local state machine
  const [gameState, setGameState] = useState<GameState>("role_reveal_handoff");

  // Role reveal phase index
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  // Question phase
  const [questionPairs, setQuestionPairs] = useState<QuestionPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Voting phase
  const [votingPlayerIndex, setVotingPlayerIndex] = useState(0);
  // voterId -> votedForId (legacy-compatible)
  const [votes, setVotes] = useState<Record<number, number>>({});

  // Round container
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);

  // 3) Helpers
  const resetRoundState = useCallback(() => {
    setGameState("role_reveal_handoff");
    setCurrentPlayerIndex(0);
    setQuestionPairs([]);
    setCurrentQuestionIndex(0);
    setVotingPlayerIndex(0);
    setVotes({});
    setRoundInfo(null);
  }, []);

  const buildRoundFromLevel = useCallback(
    (level: OutsiderLevel): RoundInfo | null => {
      if (!level || level.id === "error") return null;
      if (!teams || teams.length < MIN_PLAYERS) return null;
      if (!Array.isArray(level.words) || level.words.length === 0) return null;

      const playerIds = teams.map((t) => t.id);
      const outsiderIndex = Math.floor(Math.random() * playerIds.length);
      const outsiderId = playerIds[outsiderIndex];
      const insiders = playerIds.filter((id) => id !== outsiderId);

      // Legacy behavior: random subset for guessing board
      const shuffledWords = shuffleArray([...level.words]);
      const words = shuffledWords.slice(
        0,
        Math.min(DEFAULT_WORD_COUNT, shuffledWords.length)
      );

      // Secret must be a valid member of words
      let secret = level.solution;
      if (!words.includes(secret)) {
        secret = words[0] ?? level.solution;
      }

      return {
        id: level.id,
        category: String(level.category ?? "general"),
        secret,
        words,
        outsiderId,
        insiders,
        votes: {},
        revealed: false,
      };
    },
    [teams]
  );

  const initializeRound = useCallback(
    (level: OutsiderLevel | undefined | null) => {
      if (!level) return;
      const round = buildRoundFromLevel(level);
      if (!round) return;

      setGameState("role_reveal_handoff");
      setCurrentPlayerIndex(0);
      setQuestionPairs([]);
      setCurrentQuestionIndex(0);
      setVotingPlayerIndex(0);
      setVotes({});
      setRoundInfo(round);
    },
    [buildRoundFromLevel]
  );

  // 4) Round initialization on level/team readiness
  useEffect(() => {
    if (!currentLevel) return;
    initializeRound(currentLevel);
  }, [currentLevel, initializeRound]);

  // 5) Role reveal transitions
  const handleNextPlayer = useCallback(() => {
    if (!teams.length) return;

    if (currentPlayerIndex < teams.length - 1) {
      setCurrentPlayerIndex((prev) => prev + 1);
      setGameState("role_reveal_handoff");
    } else {
      setGameState("question_intro");
    }
  }, [currentPlayerIndex, teams.length]);

  // 6) Question setup / transitions
  const setupQuestionTurns = useCallback(() => {
    if (!teams || teams.length < 2) return;

    const shuffledPlayers = shuffleArray([...teams]);
    const pairs: QuestionPair[] = shuffledPlayers.map((asker, i) => {
      const askee = shuffledPlayers[(i + 1) % shuffledPlayers.length];
      return {
        asker: { id: asker.id, name: asker.name, color: "" },
        askee: { id: askee.id, name: askee.name, color: "" },
      };
    });

    setQuestionPairs(pairs);
    setCurrentQuestionIndex(0);
    setGameState("question_turn");
  }, [teams]);

  const handleNextQuestion = useCallback(() => {
    if (!questionPairs.length) return;

    if (currentQuestionIndex < questionPairs.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // move to voting
      setVotingPlayerIndex(0);
      setVotes({});
      setRoundInfo((prev) => (prev ? { ...prev, votes: {} } : prev));
      setGameState("voting");
    }
  }, [currentQuestionIndex, questionPairs.length]);

  // 7) Unified nextTurn expected by UI
  const nextTurn = useCallback(() => {
    if (gameState === "role_reveal_player") {
      handleNextPlayer();
      return;
    }

    if (gameState === "question_turn") {
      handleNextQuestion();
      return;
    }
  }, [gameState, handleNextPlayer, handleNextQuestion]);

  // 8) Voting flow (legacy semantics)
  const submitVote = useCallback((voterId: number, votedForId: number) => {
    setVotes((prev) => ({
      ...prev,
      [voterId]: votedForId,
    }));
  }, []);

  const finishVoting = useCallback(() => {
    setGameState("outsider_guess");
  }, []);

  const nextVoter = useCallback(() => {
    if (!teams.length) return;

    if (votingPlayerIndex < teams.length - 1) {
      setVotingPlayerIndex((prev) => prev + 1);
      return;
    }

    // Last voter finished -> compute voted player and move forward
    const tally: Record<number, number> = {};
    for (const [voterIdStr, votedForId] of Object.entries(votes)) {
      const voterId = Number(voterIdStr);
      if (!Number.isFinite(voterId)) continue;

      // Keep outsider's vote excluded for catch result compatibility with old behavior
      if (roundInfo && voterId === roundInfo.outsiderId) continue;

      tally[votedForId] = (tally[votedForId] || 0) + 1;
    }

    let votedPlayerId = -1;
    let maxVotes = -1;
    for (const [playerIdStr, count] of Object.entries(tally)) {
      const playerId = Number(playerIdStr);
      if (count > maxVotes) {
        maxVotes = count;
        votedPlayerId = playerId;
      }
    }

    setRoundInfo((prev) =>
      prev
        ? {
            ...prev,
            votes: { ...votes },
            roundResult: {
              votedPlayerId,
              outsiderGuessedCorrectly: false,
              pointsAwarded: {},
            },
          }
        : prev
    );

    finishVoting();
  }, [finishVoting, roundInfo, teams.length, votes, votingPlayerIndex]);

  // 9) Outsider guess + scoring
  const handleOutsiderGuess = useCallback(
    (guess: string) => {
      if (!roundInfo) return;

      const normalizedGuess = guess.toLowerCase().trim();
      const normalizedSecret = roundInfo.secret.toLowerCase().trim();
      const outsiderGuessedCorrectly = normalizedGuess === normalizedSecret;

      const pointsAwarded: Record<number, number> = {};
      teams.forEach((t) => {
        pointsAwarded[t.id] = 0;
      });

      // Outsider gets points if guessed correctly
      if (outsiderGuessedCorrectly) {
        pointsAwarded[roundInfo.outsiderId] =
          (pointsAwarded[roundInfo.outsiderId] || 0) + POINTS_CORRECT;
        updateScore(roundInfo.outsiderId, POINTS_CORRECT);
      }

      // Insiders get points if THEY voted the outsider (legacy semantics)
      for (const [voterIdStr, votedForId] of Object.entries(votes)) {
        const voterId = Number(voterIdStr);
        if (voterId === roundInfo.outsiderId) continue;
        if (votedForId === roundInfo.outsiderId) {
          pointsAwarded[voterId] =
            (pointsAwarded[voterId] || 0) + POINTS_CORRECT;
          updateScore(voterId, POINTS_CORRECT);
        }
      }

      setRoundInfo((prev) =>
        prev
          ? {
              ...prev,
              revealed: true,
              votes: { ...votes },
              roundResult: {
                votedPlayerId: prev.roundResult?.votedPlayerId ?? -1,
                outsiderGuessedCorrectly,
                pointsAwarded,
              },
            }
          : prev
      );

      setGameState("results");
    },
    [roundInfo, teams, updateScore, votes]
  );

  // 10) Controls exposed to UI
  const playAgain = useCallback(() => {
    // Move to next level (if available) and clear all local transient state.
    // If no next level, reinitialize current level by forcing local reset first.
    const hasNext =
      levels.length > 0 && controller.currentLevelIndex < levels.length - 1;

    resetRoundState();

    if (hasNext) {
      controller.nextLevel();
      return;
    }

    // Restart from current level if we're at the last level
    if (currentLevel) {
      initializeRound(currentLevel);
    }
  }, [
    controller,
    currentLevel,
    initializeRound,
    levels.length,
    resetRoundState,
  ]);

  const changePlayersAndReset = useCallback(() => {
    // Keep expected behavior: return to role reveal baseline after player changes.
    resetRoundState();
    controller.resetLevel();
  }, [controller, resetRoundState]);

  // 11) UI aliases (to preserve component contracts)
  const players = useMemo(() => teams || [], [teams]);

  const currentPlayerTurn = useMemo(() => {
    if (
      gameState === "role_reveal_handoff" ||
      gameState === "role_reveal_player"
    ) {
      return currentPlayerIndex;
    }
    if (gameState === "question_turn") {
      return currentQuestionIndex;
    }
    if (gameState === "voting") {
      return votingPlayerIndex;
    }
    return 0;
  }, [gameState, currentPlayerIndex, currentQuestionIndex, votingPlayerIndex]);

  const currentPlayer = useMemo(
    () => players[currentPlayerIndex],
    [players, currentPlayerIndex]
  );

  const currentQuestion = useMemo(
    () => questionPairs[currentQuestionIndex],
    [questionPairs, currentQuestionIndex]
  );

  return {
    ...controller,

    // FSM
    gameState,
    setGameState,

    // Round data
    currentRound: roundInfo,
    roundInfo,

    // players / turns
    players,
    currentPlayer,
    currentPlayerIndex,
    currentPlayerTurn,

    // question flow
    questionPairs,
    questions: questionPairs,
    currentQuestion,
    currentQuestionIndex,
    setupQuestionTurns,

    // voting flow
    submitVote,
    finishVoting,
    votingPlayerIndex,
    votersCount: votingPlayerIndex,
    votes,
    nextVoter,

    // main actions
    nextTurn,
    handleOutsiderGuess,
    playAgain,
    changePlayersAndReset,

    // internal callbacks (kept for compatibility if any UI imports them)
    handleNextPlayer,
    handleStartQuestions: setupQuestionTurns,
    handleNextQuestion,
    handleVote: submitVote,
  };
}

import type { Team } from "@powerletter/core";

export interface UseOutsideStoryResult
  extends Omit<
    ReturnType<typeof useGameController<OutsiderLevel>>,
    "gameState" | "setGameState"
  > {
  // FSM
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;

  // Round data
  currentRound: RoundInfo | null;
  roundInfo: RoundInfo | null;

  // players / turns
  players: Team[];
  currentPlayer: Team;
  currentPlayerIndex: number;
  currentPlayerTurn: number;

  // question flow
  questionPairs: QuestionPair[];
  questions: QuestionPair[];
  currentQuestion: QuestionPair | undefined;
  currentQuestionIndex: number;
  setupQuestionTurns: () => void;

  // voting flow
  submitVote: (voterId: number, votedForId: number) => void;
  finishVoting: () => void;
  votingPlayerIndex: number;
  votersCount: number;
  votes: Record<number, number>;
  nextVoter: () => void;

  // main actions
  nextTurn: () => void;
  handleOutsiderGuess: (guess: string) => void;
  playAgain: () => void;
  changePlayersAndReset: () => void;

  // internal callbacks (compatibility)
  handleNextPlayer: () => void;
  handleStartQuestions: () => void;
  handleNextQuestion: () => void;
  handleVote: (voterId: number, votedForId: number) => void;
}

