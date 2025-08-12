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

const ClueGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();

  const {
    language,
    categories,
    difficulty,
    gameMode,
    updateScore,
    currentTeam,
    setCurrentTeam,
    teams,
    nextTurn,
    consumeHint,
  } = useGameMode();

  const { t, dir } = useTranslation();

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

  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  const resetLevel = useCallback(() => {
    if (!levels.length || !currentLevel) return;
    const sol = currentLevel.solution.replace(/\s/g, "");
    setLetters(generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    dispatch({ type: "RESET", solutionLen: sol.length });
    setWrongAnswers([]);
    setNotification(null);

    if (teams.length > 0) {
      const startingTeam = currentLevelIndex % teams.length;
      setCurrentTeam(startingTeam);
    }
  }, [levels, currentLevel, currentLevelIndex, language, teams.length, setCurrentTeam]);

  const onLetterClick = useCallback((i: number) => {
    if (state.gameState === 'playing') {
      dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
    }
  }, [state.gameState, letters]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const onHint = useCallback(() => {
    if (gameMode === "competitive" && teams.length > 0) {
      const team = teams[currentTeam];
      if (!team || !consumeHint(team.id)) {
        setNotification({ message: t.noHintsLeft, type: "error" });
        setTimeout(() => setNotification(null), 2000);
        return;
      }
    }
    dispatch({ type: "HINT", solution, letters });
  }, [gameMode, teams, currentTeam, consumeHint, t.noHintsLeft, solution, letters]);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      if (gameMode === 'competitive') {
        const outcome = state.gameState === 'won' ? 'win' : 'lose';
        nextTurn(outcome);
      }
      setCurrentLevelIndex(i => i + 1);
    }
  }, [currentLevelIndex, levels.length, gameMode, nextTurn, state.gameState]);

  const onCheck = useCallback(() => {
    if (state.gameState !== 'playing') return;

    const currentAnswer = state.answerSlots.join('');
    const isCorrect = currentAnswer === solution;

    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });

      const getPoints = () => {
        if (!currentLevel) return 0;
        switch (currentLevel.difficulty) {
          case "easy": return 10;
          case "medium": return 20;
          case "hard": return 30;
          default: return 10;
        }
      };

      if (gameMode === "competitive") {
        const points = getPoints();
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: "success" });
      } else {
        setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      if (currentAnswer && !wrongAnswers.includes(currentAnswer)) {
        setWrongAnswers(prev => [...prev, currentAnswer]);
      }
      setNotification({ message: t.wrongAnswer, type: "error" });

      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        if (gameMode === 'competitive') {
          nextTurn("lose");
        }
      }, 2000);
    }
  }, [
    state.gameState, state.answerSlots, solution, currentLevel, gameMode, teams, currentTeam,
    updateScore, nextTurn, t.congrats, t.wrongAnswer, wrongAnswers
  ]);

  const onShow = useCallback(() => {
    if (state.gameState !== 'playing') return;
    dispatch({ type: "SHOW", solution, letters });
    setNotification({ message: `${t.solutionWas}: ${solution}`, type: "error" });

    if (gameMode === 'competitive') {
      setTimeout(() => {
        nextLevel();
      }, 2500);
    }
  }, [state.gameState, solution, letters, gameMode, nextLevel, t.solutionWas]);

  const onResetLevel = useCallback(() => {
    if (currentLevel) {
      setLetters(generateLetters(currentLevel.solution, currentLevel.difficulty, language));
    }
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
    setWrongAnswers([]);
  }, [currentLevel, solution.length, language]);

  const prevLevel = useCallback(() => { if (currentLevelIndex > 0) setCurrentLevelIndex(i => i - 1); }, [currentLevelIndex]);

  const handleBack = useCallback(() => {
    navigate(`/game-mode/${params.gameType}`);
  }, [navigate, params.gameType]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    loadLevels(language, categories, difficulty)
      .then((lvls) => {
        if (!mounted) return;
        setLevels(lvls);
      })
      .catch(() => {
        if (!mounted) return;
        setLevels([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [language, categories, difficulty]);

  useEffect(() => {
    if (levels.length > 0 && levels[0].solution !== 'ERROR') {
        resetLevel();
    }
  }, [currentLevelIndex, levels, resetLevel]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;

  if (!levels.length || levels[0].solution === 'ERROR') {
    return (
        <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
            <p className="text-xl font-semibold">{t.noLevelsFound}</p>
            <p className="text-muted-foreground">{levels[0]?.clue || "Please check the console for errors."}</p>
            <Button onClick={handleBack}>{t.back}</Button>
        </div>
    );
  }

  const { slotIndices, answerSlots, hintIndices, gameState } = state;
  const canHint = (gameMode === "competitive" ? (teams[currentTeam]?.hintsRemaining ?? 0) > 0 : true) && gameState === "playing";

  return (
    <>
      <Header currentView="play" showLanguage={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              {dir === "rtl" ? <><ArrowRight className="w-4 h-4" />{t.back}</> : <><ArrowLeft className="w-4 h-4" />{t.back}</>}
            </Button>
            {gameMode === "competitive" && teams.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end w-full sm:w-auto">
                {teams.map((team, idx) => (
                  <Badge key={team.id} variant={idx === currentTeam ? "default" : "secondary"} className="px-3 flex items-center gap-2">
                    <span className="font-medium">{team.name}:</span>
                    <span>{team.score}</span>
                    <span className="text-xs opacity-80">·</span>
                    <span className="text-sm flex items-center">
                      <span className="mr-1">{team.hintsRemaining}</span>
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Badge variant="secondary">{t.level} {currentLevelIndex + 1}</Badge>
            <Badge variant={currentLevel.difficulty === 'easy' ? 'default' : currentLevel.difficulty === 'medium' ? 'secondary' : 'destructive'}>
              {t[currentLevel.difficulty]}
            </Badge>
          </div>

          <Card className="mb-4 sm:mb-6">
            <CardHeader>
              <CardTitle className="text-center">{currentLevel.clue}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
              <LetterGrid letters={letters} selectedIndices={slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={gameState !== 'playing'} hintIndices={hintIndices} />
              {wrongAnswers.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t.wrongAttempts}:</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
                    {wrongAnswers.map((answer, index) => <Badge key={index} variant="destructive" className="text-xs py-1">{answer}</Badge>)}
                  </div>
                </div>
              )}
              {notification && (
                <div role="status" aria-live="polite" className={`text-center p-4 rounded-lg ${notification.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'}`}>
                  {notification.message}
                </div>
              )}
              {gameState === 'won' && (
                <div className="text-center text-green-600 flex items-center justify-center gap-2 mb-4">
                  <Trophy className="h-6 w-6" />
                  <span className="text-lg font-semibold">{t.congrats}</span>
                </div>
              )}

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
                labels={{ remove: t.remove, clear: t.clear, hint: t.hint, check: t.check, showSolution: t.showSolution, reset: t.reset, prev: t.prev, next: t.next }}
              />
            </CardContent>
          </Card>

          {gameMode === 'competitive' && teams.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-center">{t.scoreboard}</CardTitle></CardHeader>
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
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
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
