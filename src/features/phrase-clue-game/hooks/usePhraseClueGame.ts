// src/features/phrase-clue-game/hooks/usePhraseClueGame.ts
/**
 * @description Custom hook for the Phrase Clue Game.
 * This hook builds upon the shared `useClueGame` hook by adding
 * game-specific logic for checking answers, handling competitive mode
 * (scoring, turn-passing), and managing wrong attempts.
 */
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useClueGame } from '@/hooks/game/useClueGame';
import { useClueGameControls } from '@/hooks/game/useClueGameControls';
import { phraseClueGameEngine, type Level } from '../engine';

export function usePhraseClueGame() {
  // Get navigation, params, and global game state
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, difficulty, gameMode, updateScore, teams, currentTeam, setCurrentTeam, nextTurn, consumeHint } = useGameMode();
  const { t } = useTranslation();

  // Unchanged: Use the shared word puzzle hook
  const puzzle = useClueGame<Level>({
    engine: phraseClueGameEngine,
    language,
    categories,
    difficulty,
  });

  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());
  const { canRemove, canClear, canCheck, canHint } = useClueGameControls(puzzle.gameState);

  // useEffect for turn-taking
  useEffect(() => {
    if (gameMode === 'competitive' && teams.length > 0) {
      setCurrentTeam(puzzle.currentLevelIndex % teams.length);
    }
  }, [puzzle.currentLevelIndex, gameMode, teams.length, setCurrentTeam]);

  // onCheck logic
  const onCheck = useCallback(() => {
    // ... (onCheck logic remains the same)
    if (puzzle.gameState.gameState !== 'playing') return;
    const isCorrect = puzzle.gameState.answerSlots.join('') === puzzle.solution;
    if (isCorrect) {
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const points = puzzle.currentLevel?.difficulty === 'medium' ? 20 : puzzle.currentLevel?.difficulty === 'hard' ? 30 : 10;
      if (gameMode === "competitive") {
        updateScore(teams[currentTeam].id, points);
        puzzle.setNotification({ message: `${t.congrats} +${points}`, type: "success" });
        setTimeout(() => {
          puzzle.nextLevel();
          setAttemptedTeams(new Set());
        }, 2000);
      } else {
        puzzle.setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      const currentAnswer = puzzle.gameState.answerSlots.join('');
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      puzzle.setNotification({ message: t.wrongAnswer, type: "error" });
      if (gameMode === 'competitive') {
        const newAttemptedTeams = new Set(attemptedTeams).add(currentTeam);
        setAttemptedTeams(newAttemptedTeams);
        if (newAttemptedTeams.size >= teams.length) {
          setTimeout(() => {
            puzzle.dispatch({ type: "SHOW", solution: puzzle.solution, letters: puzzle.letters });
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
      } else {
        setTimeout(() => {
          puzzle.dispatch({ type: "CLEAR" });
          puzzle.dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        }, 2000);
      }
    }
  }, [puzzle, gameMode, teams, currentTeam, updateScore, nextTurn, t, wrongAnswers, attemptedTeams]);

  /**
   * @function onShow
   * @description Logic to reveal the solution.
   */
  const onShow = useCallback(() => {
    if (puzzle.gameState.gameState !== 'playing') return;

    // Show the solution in the answer slots
    puzzle.dispatch({ type: "SHOW", solution: puzzle.solution, letters: puzzle.letters });
    puzzle.setNotification({ message: `${t.solutionWas}: ${puzzle.solution}`, type: "error" });

    if (gameMode === 'competitive') {
      // In competitive mode, advance automatically after a delay
      nextTurn('lose');
      setTimeout(() => {
        puzzle.nextLevel();
        setAttemptedTeams(new Set());
      }, 2500);
    } else {
      // --- In single-player mode, set the state to 'won'. ---
      // This is crucial. By setting the state to 'won', we tell ClueGameControls
      // to display the "Next", "Previous", and "Reset" buttons, allowing the
      // player to proceed to the next level manually.
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "won" });
    }
  }, [puzzle, gameMode, t.solutionWas, nextTurn]);

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
