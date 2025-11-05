// src/features/clue-game/hooks/useClueGame.ts
/**
 * @description Custom hook for the Clue Game.
 * This hook builds upon the shared `useWordPuzzleGame` hook by adding
 * game-specific logic for checking answers, handling competitive mode
 * (scoring, turn-passing), and managing wrong attempts.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useWordPuzzleGame } from '@/features/word-puzzle/hooks/useWordPuzzleGame';
import { useGameControls } from '@/features/word-puzzle/hooks/useGameControls';
import { clueGameEngine, type Level } from '../engine';

export function useClueGame() {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty, gameMode, updateScore, teams, currentTeam, nextTurn, consumeHint } = useGameMode();
  const { t } = useTranslation();

  // Use the shared word puzzle hook. It now handles notification timeouts internally.
  const puzzle = useWordPuzzleGame<Level>({
    engine: clueGameEngine,
    language,
    categories,
    difficulty,
  });

  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());
  const { canRemove, canClear, canCheck, canHint } = useGameControls(puzzle.gameState);

  const onCheck = useCallback(() => {
    if (puzzle.gameState.gameState !== 'playing') return;
    const isCorrect = puzzle.gameState.answerSlots.join('') === puzzle.solution;

    if (isCorrect) {
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const points = puzzle.currentLevel?.difficulty === 'medium' ? 20 : puzzle.currentLevel?.difficulty === 'hard' ? 30 : 10;
      if (gameMode === "competitive") {
        updateScore(teams[currentTeam].id, points);
        // Use the auto-clearing notification setter
        puzzle.setNotification({ message: `${t.congrats} +${points}`, type: "success" });
        setTimeout(() => {
          puzzle.nextLevel();
          setAttemptedTeams(new Set());
        }, 2000);
      } else {
        // Use the auto-clearing notification setter
        puzzle.setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      const currentAnswer = puzzle.gameState.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      // Use the auto-clearing notification setter
      puzzle.setNotification({ message: t.wrongAnswer, type: "error" });

      if (gameMode === 'competitive') {
        const newAttemptedTeams = new Set(attemptedTeams).add(currentTeam);
        setAttemptedTeams(newAttemptedTeams);

        if (newAttemptedTeams.size === teams.length) {
          setTimeout(() => {
            puzzle.dispatch({ type: "SHOW", solution: puzzle.solution, letters: puzzle.letters });
            // Use the auto-clearing notification setter
            puzzle.setNotification({ message: `${t.solutionWas}: ${puzzle.solution}`, type: "error" });
            setTimeout(() => {
              puzzle.nextLevel();
              setAttemptedTeams(new Set());
            }, 2500);
          }, 2000);
        } else {
          setTimeout(() => {
            puzzle.dispatch({ type: "CLEAR" });
            puzzle.dispatch({ type: "SET_GAME_STATE", payload: "playing" });
            nextTurn("lose");
          }, 2000);
        }
      }
    }
  }, [puzzle, gameMode, teams, currentTeam, updateScore, nextTurn, t, wrongAnswers, attemptedTeams]);

  const onShow = useCallback(() => {
    if (puzzle.gameState.gameState !== 'playing') return;
    
    puzzle.dispatch({ type: "SHOW", solution: puzzle.solution, letters: puzzle.letters });
    // Use the auto-clearing notification setter
    puzzle.setNotification({ message: `${t.solutionWas}: ${puzzle.solution}`, type: "error" });

    if (gameMode === 'competitive') {
      setTimeout(() => {
        puzzle.nextLevel();
        setAttemptedTeams(new Set());
      }, 2500);
    }
  }, [puzzle, gameMode, t.solutionWas]);

  const onHint = useCallback(() => {
    if (gameMode === "competitive" && !consumeHint(teams[currentTeam].id)) {
      // Use the auto-clearing notification setter
      puzzle.setNotification({ message: t.noHintsLeft, type: "error" });
      return;
    }
    puzzle.dispatch({ type: "HINT", solution: puzzle.solution, letters: puzzle.letters });
  }, [puzzle, gameMode, teams, currentTeam, consumeHint, t.noHintsLeft]);

  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${params.gameType}`);
    } else {
      navigate(`/game-mode/${params.gameType}`);
    }
  }, [navigate, params.gameType, gameMode]);

  useEffect(() => {
    setWrongAnswers([]);
  }, [puzzle.currentLevelIndex]);

  return {
    ...puzzle,
    wrongAnswers,
    onCheck,
    onShow,
    onHint,
    handleBack,
    canRemove,
    canClear,
    canCheck,
    canHint,
  };
}
