// src/components/GameScreens/word-choice-game/WordChoiceScreen.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/layout/GameLayout";
import { useWordChoiceGame } from "@/features/word-choice-game/hooks/useWordChoice";
import { cn } from "@/lib/utils";

const WordChoiceScreen: React.FC = () => {
  const { t, dir } = useTranslation();

  const {
    loading,
    currentLevel,
    shuffledOptions,
    answerStatus,
    selectedOption,
    audioRef,
    getAssetPath,
    playSound,
    handleOptionClick,
    nextLevel,
    handleBack,
  } = useWordChoiceGame();

  // --- Render Logic ---
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  if (!currentLevel || currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  return (
    <GameLayout title={t.wordChoiceTitle} levelIndex={0} onBack={handleBack}>
      {/* Image and Sound Button */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <img src={getAssetPath(currentLevel.image)} alt="Guess the word" className="max-h-full max-w-full object-contain" />
        <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
          <Volume2 className="h-6 w-6 text-white" />
        </Button>
        <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
      </div>

      {/* Word Choice Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {shuffledOptions.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectSolution = option === currentLevel.solution;
          
          return (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={answerStatus !== 'idle'}
              className={cn(
                "text-lg h-20 flex items-center justify-center gap-2",
                // Style when this option is selected and correct
                isSelected && answerStatus === 'correct' && "bg-green-500 hover:bg-green-600 border-2 border-green-700",
                // Style when this option is selected and incorrect
                isSelected && answerStatus === 'incorrect' && "bg-red-500 hover:bg-red-500 border-2 border-red-700",
                // Style for the correct answer when an incorrect one was chosen
                !isSelected && answerStatus === 'incorrect' && isCorrectSolution && "bg-green-200 text-green-800 border-2 border-green-400",
                // Default button style
                answerStatus === 'idle' && "bg-card text-card-foreground hover:bg-muted"
              )}
            >
              {option}
              {isSelected && answerStatus === 'correct' && <CheckCircle />}
              {isSelected && answerStatus === 'incorrect' && <XCircle />}
            </Button>
          );
        })}
      </div>
      
      {/* Next Level Button */}
      {answerStatus === 'correct' && (
        <div className="pt-4">
          <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            {t.next} {dir === 'rtl' ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        </div>
      )}
    </GameLayout>
  );
};

export default WordChoiceScreen;
