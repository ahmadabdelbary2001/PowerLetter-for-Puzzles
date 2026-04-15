"use client";

// src/hooks/game/useOutsideStory.ts
/**
 * @description The main logic hook for the "Outside the Story" game.
 * It manages the complex state machine (role reveal, questions, voting, guessing).
 */
import { useState, useCallback, useMemo, useEffect } from 'react';
import type { 
  OutsiderLevel, 
  GameState, 
  QuestionPair, 
  RoundInfo
} from '@core/entities/model/OutsideStory';
import { POINTS_CORRECT } from '@core/entities/model/OutsideStory';
import { outsideStoryGameEngine as engine } from '@core/features/games/engine/outside-story-gameEngine';
import { useGameController } from '@core/shared/hooks/game/useGameController';
import { shuffleArray } from '@core/shared/lib/gameUtils';

export function useOutsideStory() {
  // 1. Initialize the base game controller.
  const controller = useGameController<OutsiderLevel>({
    engine,
    gameId: 'outsideStory',
  });

  const {
    currentLevel,
    gameModeState,
  } = controller;

  const { teams, updateScore } = gameModeState;

  // 2. Local game state
  const [gameState, setGameState] = useState<GameState>('role_reveal_handoff');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roundInfo, setRoundInfo] = useState<RoundInfo | null>(null);
  const [questions, setQuestions] = useState<QuestionPair[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [votes, setVotes] = useState<Record<number, number>>({});
  const [votersCount, setVotersCount] = useState(0);

  // 3. Initialize a new round when the level changes
  useEffect(() => {
    if (!currentLevel || currentLevel.id === 'error' || teams.length < 3) return;

    // Reset local state
    setGameState('role_reveal_handoff');
    setCurrentPlayerIndex(0);
    setVotes({});
    setVotersCount(0);

    // Prepare round info
    const playerIds = teams.map(t => t.id);
    const outsiderIndex = Math.floor(Math.random() * playerIds.length);
    const outsiderId = playerIds[outsiderIndex];
    const insiders = playerIds.filter(id => id !== outsiderId);

    // Prepare questions (everyone asks the person to their right)
    const shuffledPlayers = shuffleArray([...teams]);
    const questionPairs: QuestionPair[] = shuffledPlayers.map((player, i) => {
      const nextPlayer = shuffledPlayers[(i + 1) % shuffledPlayers.length];
      return {
        asker: { id: player.id, name: player.name, color: '' }, // Colors are handled in mapping below
        askee: { id: nextPlayer.id, name: nextPlayer.name, color: '' },
      };
    });

    setQuestions(questionPairs);
    setRoundInfo({
      id: currentLevel.id,
      category: currentLevel.category,
      secret: currentLevel.solution,
      words: currentLevel.words,
      outsiderId,
      insiders,
      votes: {},
      revealed: false,
    });
  }, [currentLevel, teams]);

  // 4. Transitions
  const handleNextPlayer = useCallback(() => {
    if (gameState === 'role_reveal_player') {
      if (currentPlayerIndex < teams.length - 1) {
        setCurrentPlayerIndex(prev => prev + 1);
        setGameState('role_reveal_handoff');
      } else {
        setGameState('question_intro');
      }
    }
  }, [gameState, currentPlayerIndex, teams.length]);

  const handleStartQuestions = useCallback(() => {
    setGameState('question_turn');
    setCurrentQuestionIndex(0);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('voting');
    }
  }, [currentQuestionIndex, questions.length]);

  const handleVote = useCallback((votedForId: number) => {
    setVotes(prev => ({
      ...prev,
      [votedForId]: (prev[votedForId] || 0) + 1,
    }));
    
    setVotersCount(prev => {
      const newCount = prev + 1;
      if (newCount >= teams.length) {
        // Calculate the winner of the vote
        setGameState('results');
      }
      return newCount;
    });
  }, [teams.length]);

  const handleOutsiderGuess = useCallback((guess: string) => {
    if (!roundInfo) return;
    
    const isCorrect = guess.toLowerCase().trim() === roundInfo.secret.toLowerCase().trim();
    
    // Calculate points
    const pointsAwarded: Record<number, number> = {};
    if (isCorrect) {
      pointsAwarded[roundInfo.outsiderId] = POINTS_CORRECT;
      updateScore(roundInfo.outsiderId, POINTS_CORRECT);
    } else {
      roundInfo.insiders.forEach(id => {
        pointsAwarded[id] = POINTS_CORRECT / 2;
        updateScore(id, POINTS_CORRECT / 2);
      });
    }

    setRoundInfo(prev => prev ? {
      ...prev,
      roundResult: {
        outsiderGuessedCorrectly: isCorrect,
        pointsAwarded,
      }
    } : null);

    setGameState('round_end');
  }, [roundInfo, updateScore]);

  // 5. Computed
  const currentPlayer = useMemo(() => teams[currentPlayerIndex], [teams, currentPlayerIndex]);
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  return {
    ...controller,
    gameState,
    setGameState,
    currentPlayer,
    currentPlayerIndex,
    roundInfo,
    questions,
    currentQuestion,
    currentQuestionIndex,
    votersCount,
    votes,
    handleNextPlayer,
    handleStartQuestions,
    handleNextQuestion,
    handleVote,
    handleOutsiderGuess,
  };
}
