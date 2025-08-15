// src/components/GameScreens/WordChoiceGame/WordChoiceScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useGameMode } from "@/hooks/useGameMode";
import { loadWordChoiceLevels } from "@/features/word-choice-game/engine";
import type { WordChoiceLevel } from "@/features/word-choice-game/engine";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { shuffleArray } from "@/lib/gameUtils";
import { cn } from "@/lib/utils";

const WordChoiceScreen: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ gameType?: string }>();
  const { language, categories } = useGameMode();
  const { t, dir } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [levels, setLevels] = useState<WordChoiceLevel[]>([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentLevel = levels[currentLevelIndex];

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

  const nextLevel = useCallback(() => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(i => i + 1);
      setAnswerStatus('idle');
      setSelectedOption(null);
    } else {
      navigate('/kids-games');
    }
  }, [currentLevelIndex, levels.length, navigate]);

  const handleOptionClick = (option: string) => {
    if (answerStatus !== 'idle') return;

    setSelectedOption(option);
    if (option === currentLevel.solution) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleBack = useCallback(() => navigate(`/game-mode/${params.gameType}`), [navigate, params.gameType]);

  useEffect(() => {
    setLoading(true);
    loadWordChoiceLevels(language, categories)
      .then(setLevels)
      .finally(() => setLoading(false));
  }, [language, categories]);

  useEffect(() => {
    if (currentLevel) {
      const options = shuffleArray([...currentLevel.options, currentLevel.solution]);
      setShuffledOptions(options);
    }
  }, [currentLevel]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
          </Button>

          <Card className="mb-4 sm:mb-6 overflow-hidden">
            <CardContent className="p-4 space-y-6">
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <img src={getAssetPath(currentLevel.image)} alt="Guess the word" className="max-h-full max-w-full object-contain" />
                <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
                  <Volume2 className="h-6 w-6 text-white" />
                </Button>
                <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {shuffledOptions.map((option) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentLevel.solution;
                  
                  return (
                    <Button
                      key={option}
                      onClick={() => handleOptionClick(option)}
                      disabled={answerStatus !== 'idle'}
                      className={cn(
                        "text-lg h-20",
                        isSelected && answerStatus === 'correct' && "bg-green-500 hover:bg-green-600",
                        isSelected && answerStatus === 'incorrect' && "bg-red-500 hover:bg-red-500",
                        !isSelected && answerStatus !== 'idle' && isCorrect && "bg-green-500 border-2 border-green-700",
                        !isSelected && "bg-card text-card-foreground hover:bg-muted"
                      )}
                    >
                      {option}
                      {isSelected && answerStatus === 'correct' && <CheckCircle className="ml-2" />}
                      {isSelected && answerStatus === 'incorrect' && <XCircle className="ml-2" />}
                    </Button>
                  );
                })}
              </div>
              
              {answerStatus === 'correct' && (
                <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                  {t.next} {dir === 'rtl' ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default WordChoiceScreen;
