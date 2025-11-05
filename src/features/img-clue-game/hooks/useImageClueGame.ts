// src/features/img-clue-game/hooks/useImageClueGame.ts
/**
 * @description Custom hook for the Image Clue Game.
 * This hook builds upon the shared `useWordPuzzleGame` hook by adding
 * game-specific logic for checking answers, handling competitive mode
 * (scoring, turn-passing), and managing audio playback.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useWordPuzzleGame } from '@/features/word-puzzle/hooks/useWordPuzzleGame';
import { useGameControls } from '@/features/word-puzzle/hooks/useGameControls';
import { imgClueGameEngine, type ImageLevel } from '../engine';

export function useImageClueGame() {
  // Get navigation, params, and global game state
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, gameMode, updateScore, teams, currentTeam, setCurrentTeam, nextTurn, consumeHint } = useGameMode()
  const { t } = useTranslation();

  // Use the shared word puzzle hook
  const puzzle = useWordPuzzleGame<ImageLevel>({
    engine: imgClueGameEngine,
    language,
    categories,
    difficulty: 'easy',
  });

  // Image-Clue Specific State
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [attemptedTeams, setAttemptedTeams] = useState<Set<number>>(new Set());
  const { canRemove, canClear, canCheck, canHint } = useGameControls(puzzle.gameState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Helper functions
  const getAssetPath = (path: string) => {
    const base = (import.meta).env?.BASE_URL ?? '/';
    const baseUrl = String(base).replace(/\/+$/, '');
    const normalized = path.replace(/^\/+/, '');
    return `${baseUrl}/${normalized}`;
  };
  const playSound = useCallback(() => {
    audioRef.current?.play().catch((e) => console.error('Audio play failed:', e));
  }, []);

  /**
   * @function onCheck
   * @description Game-specific logic to check the user's answer.
   * This has been updated to correctly handle competitive turn-taking.
   */
  useEffect(() => {
    if (gameMode === 'competitive' && teams.length > 0) {
      // The current team is determined by the level index modulo the number of teams.
      setCurrentTeam(puzzle.currentLevelIndex % teams.length);
    }
    // This effect runs whenever the level changes.
  }, [puzzle.currentLevelIndex, gameMode, teams.length, setCurrentTeam]);


  /**
   * @function onCheck
   * @description Game-specific logic to check the user's answer.
   */
  const onCheck = useCallback(() => {
    if (puzzle.gameState.gameState !== 'playing') return;
    const isCorrect = puzzle.gameState.answerSlots.join('').toLowerCase() === puzzle.solution.toLowerCase();

    if (isCorrect) {
      puzzle.dispatch({ type: "SET_GAME_STATE", payload: "won" });
      if (gameMode === "competitive") {
        updateScore(teams[currentTeam].id, 1);
        puzzle.setNotification({ message: `${t.congrats} +1`, type: "success" });
        // We no longer need to call nextTurn('win') here because the useEffect handles the turn change.
        setTimeout(() => {
          puzzle.nextLevel();
          setAttemptedTeams(new Set());
        }, 1500);
      } else {
        puzzle.setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      // Unchanged: Incorrect answer logic
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
          // This part is still correct: pass the turn immediately to the next player on the same question.
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
    puzzle.dispatch({ type: "SHOW", solution: puzzle.solution, letters: puzzle.letters });
    puzzle.setNotification({ message: `${t.solutionWas}: ${puzzle.solution}`, type: "error" });
    if (gameMode === 'competitive') {
      // --- FIX: Call nextTurn('lose') when showing the solution ---
      nextTurn('lose');
      setTimeout(() => {
        puzzle.nextLevel();
        setAttemptedTeams(new Set());
      }, 2500);
    }
  }, [puzzle, gameMode, t.solutionWas, nextTurn]);

  // onHint logic (not used in kids mode, but part of the shared hook)
  const onHint = useCallback(() => {
    if (gameMode === "competitive" && !consumeHint(teams[currentTeam].id)) {
      puzzle.setNotification({ message: t.noHintsLeft, type: "error" });
      return;
    }
    puzzle.dispatch({ type: "HINT", solution: puzzle.solution, letters: puzzle.letters });
  }, [puzzle, gameMode, teams, currentTeam, consumeHint, t.noHintsLeft]);

  // Navigation back handler
  const handleBack = useCallback(() => {
    if (gameMode === 'competitive') {
      navigate(`/team-config/${params.gameType}`);
    } else {
      navigate('/games');
    }
  }, [navigate, params.gameType, gameMode]);

  // Effect to clear wrong answers on level change
  useEffect(() => {
    setWrongAnswers([]);
  }, [puzzle.currentLevelIndex]);

  // --- Combine the shared puzzle logic with the game-specific logic ---
  return {
    ...puzzle, // Spread all the shared state and functions
    wrongAnswers,
    onCheck,
    onShow,
    onHint,
    handleBack,
    canRemove,
    canClear,
    canCheck,
    canHint,
    // Add game-specific returns
    audioRef,
    getAssetPath,
    playSound,
  };
}
