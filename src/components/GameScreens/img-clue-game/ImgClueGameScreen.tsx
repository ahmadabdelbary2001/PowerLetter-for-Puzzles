// src/components/GameScreens/ImgClueGame/ImgClueGameScreen.tsx
import React, { useReducer, useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "../clue-game/SolutionBoxes";
import { LetterGrid } from "../clue-game/LetterGrid";
import GameControls from "../clue-game/GameControls";
import { ArrowLeft, ArrowRight, Volume2, Lightbulb } from "lucide-react";
import { useGameMode } from "@/hooks/useGameMode";
import { loadImageClueLevels, generateLetters } from "@/features/img-clue-game/engine";
import type { ImageLevel } from "@/features/img-clue-game/engine";
import { reducer } from "../clue-game/gameReducer";
import type { State, Action } from "../clue-game/gameReducer";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const ImgClueGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories, gameMode, updateScore, currentTeam, setCurrentTeam, teams, nextTurn } = useGameMode();
  const { t, dir } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, {
    slotIndices: [], answerSlots: [], hintIndices: [], gameState: "playing",
  });

  const [levels, setLevels] = useState<ImageLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);
  
  const currentLevel = levels[currentLevelIndex];
  const solution = currentLevel?.solution.replace(/\s/g, "") ?? "";

  const getAssetPath = (path: string) => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const assetPath = path.replace(/^\//, '');
    return `${baseUrl}/${assetPath}`;
  };

  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, []);

  const resetLevel = useCallback(() => {
    if (!levels.length || !currentLevel) return;
    // FIX: Removed the extra 'easy' argument. The function now only needs 2 arguments.
    setLetters(generateLetters(currentLevel.solution, language));
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
    if (teams.length > 0) {
      setCurrentTeam(currentLevelIndex % teams.length);
    }
  }, [levels, currentLevel, currentLevelIndex, language, teams.length, setCurrentTeam, solution.length]);

  const onLetterClick = useCallback((i: number) => {
    if (state.gameState === 'playing') dispatch({ type: "PLACE", gridIndex: i, letter: letters[i] });
  }, [state.gameState, letters]);

  const onRemove = useCallback(() => dispatch({ type: "REMOVE_LAST" }), []);
  const onClear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
    } else {
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const onCheck = useCallback(() => {
    if (state.gameState !== 'playing') return;
    const isCorrect = state.answerSlots.join('') === solution;

    if (isCorrect) {
      dispatch({ type: "SET_GAME_STATE", payload: "won" });
      const points = 10;
      if (gameMode === "competitive" && teams.length > 0) {
        updateScore(teams[currentTeam].id, points);
        setNotification({ message: `${t.congrats} +${points}`, type: "success" });
      } else {
        setNotification({ message: t.congrats, type: "success" });
      }
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: t.wrongAnswer, type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
        if (gameMode === 'competitive') {
          nextTurn("lose");
        }
      }, 1500);
    }
  }, [state.gameState, state.answerSlots, solution, gameMode, teams, currentTeam, updateScore, nextTurn, t.congrats, t.wrongAnswer]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  useEffect(() => {
    setLoading(true);
    loadImageClueLevels(language, categories)
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  useEffect(() => {
    if (levels.length > 0) resetLevel();
  }, [currentLevelIndex, levels, resetLevel]);

  if (loading) return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  if (!currentLevel || currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  return (
    <>
      <Header currentView="play" showLanguage={false} />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
              {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
            </Button>
            {gameMode === "competitive" && teams.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end w-full sm:w-auto">
                {teams.map((team, idx) => (
                  <Badge key={team.id} variant={idx === currentTeam ? "default" : "secondary"} className="px-3 flex items-center gap-2">
                    <span className="font-medium">{team.name}:</span>
                    <span>{team.score}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Card className="mb-4 sm:mb-6 overflow-hidden">
            <CardContent className="p-4 space-y-6">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <img src={getAssetPath(currentLevel.image)} alt={solution} className="max-h-full max-w-full object-contain" />
                <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
                  <Volume2 className="h-6 w-6 text-white" />
                </Button>
                <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
              </div>

              <SolutionBoxes solution={solution} currentWord={state.answerSlots.join('')} />
              <LetterGrid letters={letters} selectedIndices={state.slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={state.gameState !== 'playing'} hintIndices={state.hintIndices} />
              
              {notification && (
                <div role="status" className={`text-center p-3 rounded-lg text-lg font-bold ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {notification.message}
                </div>
              )}

              {state.gameState === 'won' ? (
                <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                  {t.next} {dir === 'rtl' ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
                </Button>
              ) : (
                <GameControls
                  onRemoveLetter={onRemove}
                  onClearAnswer={onClear}
                  onCheckAnswer={onCheck}
                  canRemove={state.slotIndices.some(i => i !== null)}
                  canClear={state.slotIndices.some(i => i !== null)}
                  canCheck={state.answerSlots.every(ch => ch !== '')}
                  gameState={state.gameState as 'playing' | 'failed'}
                  labels={{ remove: t.remove, clear: t.clear, check: t.check, hint: '', showSolution: '', reset: '', prev: '', next: '' }}
                  isKidsMode={true}
                />
              )}
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

export default ImgClueGameScreen;
