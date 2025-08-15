// src/components/GameScreens/ImgClueGame/ImgClueGameScreen.tsx
import React, { useReducer, useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SolutionBoxes } from "../ClueGame/SolutionBoxes";
import { LetterGrid } from "../ClueGame/LetterGrid";
import GameControls from "../ClueGame/GameControls";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useGameMode } from "@/hooks/useGameMode";
import { loadImageClueLevels, generateLetters } from "@/features/clue-game/engine";
import type { ImageLevel } from "@/features/clue-game/engine";
import { reducer } from "../ClueGame/gameReducer";
import type { State, Action } from "../ClueGame/gameReducer";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";

const ImgClueGameScreen: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories } = useGameMode();
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
    setLetters(generateLetters(currentLevel.solution, 'easy', language));
    dispatch({ type: "RESET", solutionLen: solution.length });
    setNotification(null);
  }, [levels, currentLevel, language, solution.length]);

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
      setNotification({ message: t.congrats, type: "success" });
    } else {
      dispatch({ type: "SET_GAME_STATE", payload: "failed" });
      setNotification({ message: t.wrongAnswer, type: "error" });
      setTimeout(() => {
        dispatch({ type: "CLEAR" });
        dispatch({ type: "SET_GAME_STATE", payload: "playing" });
        setNotification(null);
      }, 1500);
    }
  }, [state.gameState, state.answerSlots, solution, t.congrats, t.wrongAnswer]);

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  useEffect(() => {
    setLoading(true);
    // FIX: Pass the entire 'categories' array to the loading function.
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
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
          </Button>

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
        </div>
      </div>
    </>
  );
};

export default ImgClueGameScreen;
