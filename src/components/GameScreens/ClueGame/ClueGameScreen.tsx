// src/components/GameScreens/ClueGame/ClueGameScreen.tsx
import React, { useReducer, useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "./SolutionBoxes";
import { LetterGrid } from "./LetterGrid";
import GameControls from "./GameControls";
import { ArrowLeft, ArrowRight, Trophy, Lightbulb } from "lucide-react";
import { useGameMode } from "@/hooks/useGameMode";
import { loadLevels, generateLetters } from "@/features/clue-game/engine";
import type { Difficulty } from "@/types/game";
import { reducer } from "./gameReducer";
import type { State, Action } from "./gameReducer";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useSolverWorker } from "@/hooks/useSolverWorker";

interface ClueGameScreenProps {
  onBack?: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = () => {
  // --- Hooks: ALL MUST BE CALLED UNCONDITIONALLY AT THE TOP ---
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string; language?: string }>();

  // destructure only the things we actually use (avoid unused vars warnings)
  const {
    language,
    setLanguage,
    gameMode,
    updateScore,
    currentTeam,
    setCurrentTeam,
    teams,
    nextTurn,
    consumeHint,
  } = useGameMode();

  const { t, dir } = useTranslation();

  // solver worker hook MUST be called unconditionally
  const { findWords } = useSolverWorker();

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [],
    answerSlots: [],
    hintIndices: [],
    gameState: "playing",
  });

  const [levels, setLevels] = useState<{ id: string; difficulty: Difficulty; clue: string; solution: string }[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [pointsAwarded, setPointsAwarded] = useState(false);

  // derived
  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  // --- All callbacks declared unconditionally (so hooks order never changes) ---
  const resetLevel = useCallback(() => {
    if (!levels.length) return;
    const lvl = levels[currentLevelIndex];
    const sol = lvl.solution.replace(/\s/g, "");
    setLetters(generateLetters(lvl.solution, lvl.difficulty, language as "en" | "ar"));
    dispatch({ type: "RESET", solutionLen: sol.length });
    setWrongAnswers([]);
    setNotification(null);
    setPointsAwarded(false);

    if (teams.length > 0) {
      const startingTeam = currentLevelIndex % teams.length;
      setCurrentTeam(startingTeam);
    }
  }, [levels, currentLevelIndex, language, teams.length, setCurrentTeam]);

  const onLetterClick = useCallback((i: number) => dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] }), [letters]);
  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const onHint = useCallback(() => {
    if (gameMode === "competitive" && teams.length > 0) {
      const team = teams[currentTeam];
      if (!team) {
        setNotification({ message: t.noHintsLeft, type: "error" });
        setTimeout(() => setNotification(null), 2000);
        return;
      }
      const consumed = consumeHint(team.id);
      if (!consumed) {
        setNotification({ message: t.noHintsLeft, type: "error" });
        setTimeout(() => setNotification(null), 2000);
        return;
      }
      dispatch({ type: "HINT", solution, letters });
      return;
    }
    dispatch({ type: "HINT", solution, letters });
  }, [gameMode, teams, currentTeam, consumeHint, t.noHintsLeft, solution, letters]);

  const onShow = useCallback(() => dispatch({ type: "SHOW", solution, letters }), [solution, letters]);
  const onCheck = useCallback(() => dispatch({ type: "CHECK", solution }), [solution]);

  const onResetLevel = useCallback(() => {
    if (currentLevel) {
      setLetters(generateLetters(currentLevel.solution, currentLevel.difficulty, language as "en" | "ar"));
    }
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
    setWrongAnswers([]);
    setPointsAwarded(false);
  }, [currentLevel, solution.length, language]);

  const prevLevel = useCallback(() => { if (currentLevelIndex > 0) setCurrentLevelIndex(i => i - 1); }, [currentLevelIndex]);
  const nextLevel = useCallback(() => { if (currentLevelIndex < levels.length - 1) setCurrentLevelIndex(i => i + 1); }, [currentLevelIndex, levels.length]);

  const handleBack = useCallback(() => {
    const gameType = params.gameType;
    if (gameMode === "competitive") {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate(`/game-mode/${gameType}`);
    }
  }, [navigate, params.gameType, gameMode]);

  const handleRevealOrListSolutions = useCallback(async () => {
    try {
      const sols = await findWords(letters, language === 'ar' ? 'ar' : 'en', 2);
      if (sols && sols.length > 0) {
        const normalizedSolution = solution.normalize('NFC').replace(/\s/g, '');
        const exact = sols.find(s => s.replace(/\s/g, '') === normalizedSolution);
        if (exact) {
          dispatch({ type: 'SHOW', solution, letters });
          return;
        }
        setNotification({ message: `${sols.slice(0, 5).join(', ')}`, type: 'success' });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({ message: t.unknown ?? 'No suggestions', type: 'error' });
        setTimeout(() => setNotification(null), 2000);
      }
    } catch {
      setNotification({ message: t.unknown ?? 'No suggestions', type: 'error' });
      setTimeout(() => setNotification(null), 2000);
    }
  }, [findWords, letters, language, solution, t.unknown]);

  // --- Effects (still unconditional) ---
  useEffect(() => {
    if (params.language && params.language !== language) {
      const supportedLanguages = ['en', 'ar'];
      if (supportedLanguages.includes(params.language)) {
        setLanguage(params.language as 'en' | 'ar');
      }
    }
  }, [params.language, language, setLanguage]);

  useEffect(() => {
    let mounted = true;
    loadLevels(language as "en" | "ar")
      .then((lvls) => {
        if (!mounted) return;
        setLevels(lvls);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLevels([]);
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [language]);

  useEffect(() => {
    resetLevel();
  }, [resetLevel]);

  useEffect(() => {
    if (state.gameState !== "failed") return;
    const currentAnswer = state.answerSlots.join("");
    if (!wrongAnswers.includes(currentAnswer)) setWrongAnswers(prev => [...prev, currentAnswer]);
    setNotification({ message: t.wrongAnswer, type: "error" });
    const timer = setTimeout(() => {
      dispatch({ type: "CLEAR" });
      if (teams.length > 1) setCurrentTeam(prev => (prev + 1) % teams.length);
      setNotification(null);
      nextTurn("lose");
    }, 2000);
    return () => clearTimeout(timer);
  }, [state.gameState, state.answerSlots, wrongAnswers, t.wrongAnswer, teams.length, setCurrentTeam, nextTurn]);

  useEffect(() => {
    if (state.gameState !== "won" || !currentLevel || pointsAwarded) return;
    const getPoints = () => {
      switch (currentLevel.difficulty) {
        case "easy": return 10;
        case "medium": return 20;
        case "hard": return 30;
        default: return 10;
      }
    };
    if (gameMode === "competitive" && teams.length > 0) {
      const points = getPoints();
      updateScore(teams[currentTeam].id, points);
      setNotification({ message: `+${points} ${t.congrats}`, type: "success" });
      setPointsAwarded(true);
    } else {
      setNotification({ message: t.congrats, type: "success" });
      setPointsAwarded(true);
    }
  }, [state.gameState, currentLevel, gameMode, teams, currentTeam, updateScore, t.congrats, pointsAwarded]);

  // Early UI return (hooks already executed above)
  if (loading) return <p>Loading...</p>;

  // Deconstruct reducer state for rendering
  const { slotIndices, answerSlots, hintIndices, gameState } = state;

  const canHint = gameMode === "competitive"
    ? (teams[currentTeam]?.hintsRemaining ?? 0) > 0 && gameState === "playing"
    : gameState === "playing";

  return (
    <>
      <Header currentView="play" showLanguage={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
          {/* Back + Team status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              {dir === "rtl" ? (<><ArrowRight className="w-4 h-4" />{t.back}</>) : (<><ArrowLeft className="w-4 h-4" />{t.back}</>)}
            </Button>

            {gameMode === "competitive" && teams.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end w-full sm:w-auto">
                {teams.map((team, idx) => (
                  <Badge key={team.id} variant={idx === currentTeam ? "default" : "secondary"} className="px-3 flex items-center gap-2">
                    <span className="font-medium">{team.name}:</span>
                    <span>{team.score}</span>
                    <span className="text-xs opacity-80">·</span>
                    <span className="text-sm flex items-center" aria-hidden={false}>
                      <span className="mr-1">{team.hintsRemaining}</span>
                      <Lightbulb className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Level & Difficulty */}
          <div className="flex justify-between items-center">
            <Badge variant="secondary">{t.level} {currentLevelIndex + 1}</Badge>
            <Badge variant={currentLevel?.difficulty === 'easy' ? 'default' : currentLevel?.difficulty === 'medium' ? 'secondary' : 'destructive'}>
              {currentLevel?.difficulty === 'easy' ? t.easy : currentLevel?.difficulty === 'medium' ? t.medium : t.hard}
            </Badge>
          </div>

          {/* Main Card */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-center">{currentLevel?.clue}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8">
              <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
              <LetterGrid letters={letters} selectedIndices={slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={gameState !== 'playing'} hintIndices={hintIndices} />

              {wrongAnswers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.wrongAttempts}:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {wrongAnswers.map((answer, index) => (
                      <Badge key={index} variant="destructive" className="text-xs py-1">{answer}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {notification && (
                <div role="status" aria-live="polite" aria-atomic="true" className={`text-center p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'}`}>
                  {notification.message}
                </div>
              )}

              {gameState === 'won' && notification?.type !== 'success' && (
                <div className="text-center">
                  <div className="text-green-600 flex items-center justify-center gap-2 mb-4">
                    <Trophy className="h-6 w-6" />
                    <span className="text-lg font-semibold">{t.congrats}</span>
                  </div>
                </div>
              )}

              {gameState !== 'failed' && (
                <>
                  <GameControls
                    onReset={onResetLevel}
                    onRemoveLetter={onRemove}
                    onClearAnswer={onClear}
                    onHint={onHint}
                    onCheckAnswer={onCheck}
                    onShowSolution={onShow}
                    onPrevLevel={prevLevel}
                    onNextLevel={nextLevel}
                    canRemove={slotIndices.some(i => i !== null && !hintIndices.includes(i as number))}
                    canClear={slotIndices.filter(i => i !== null).length > hintIndices.length}
                    canCheck={answerSlots.every(ch => ch !== '')}
                    canPrev={currentLevelIndex > 0}
                    canNext={currentLevelIndex < levels.length - 1}
                    canHint={canHint}
                    gameState={gameState}
                    labels={{
                      remove: t.remove,
                      clear: t.clear,
                      hint: t.hint,
                      check: t.check,
                      showSolution: t.showSolution,
                      reset: t.reset,
                      prev: t.prev,
                      next: t.next,
                    }}
                  />

                  <div className="flex justify-center mt-3">
                    <Button variant="outline" onClick={handleRevealOrListSolutions}>
                      💡 {t.hint}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {gameMode === 'competitive' && teams.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{t.scoreboard}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {teams.map((team, index) => (
                    <div key={team.id} className={cn("flex justify-between items-center p-3 rounded-lg", index === currentTeam ? "bg-primary/20 border border-primary" : "bg-muted")}>
                      <div className="flex items-center">
                        <span className="font-medium">{team.name}</span>
                        {index === currentTeam && <Badge className="ml-2">{t.currentTurn}</Badge>}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={index === currentTeam ? 'default' : 'secondary'}>{team.score}</Badge>
                        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <span className="mr-1">{team.hintsRemaining}</span>
                          <Lightbulb className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default ClueGameScreen;
