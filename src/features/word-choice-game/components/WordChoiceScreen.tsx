// src/features/word-choice-game/components/WordChoiceScreen.tsx
/**
 * This component implements the UI for the Word Choice game.
 * It is wrapped by the `GameScreen` HOC to handle loading and error states,
 * keeping this file focused solely on the game's presentation logic.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useWordChoiceGame } from "@/features/word-choice-game/hooks/useWordChoiceGame";
import { cn } from "@/lib/utils";
import { MultipleChoiceLayout } from "@/components/templates/MultipleChoiceLayout";
import { GameScreen } from "@/components/organisms/GameScreen"; // Import the HOC

// 1. Define the pure UI component.
const WordChoiceGame: React.FC<ReturnType<typeof useWordChoiceGame>> = ({
  currentLevel,
  shuffledOptions,
  answerStatus,
  selectedOption,
  notification,
  onClearNotification,
  audioRef,
  getAssetPath,
  playSound,
  handleOptionClick,
  nextLevel,
  handleBack,
  t,
  i18n,
  instructions,
}) => {
  const dir = i18n.dir();

  return (
    <MultipleChoiceLayout
      title={t('wordChoiceTitle', { ns: 'games' })}
      levelIndex={0}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
      promptContent={
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <img src={getAssetPath(currentLevel.image)} alt="Guess the word" className="max-h-full max-w-full object-contain" />
          <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70" aria-label={t('playSound')}>
            <Volume2 className="h-6 w-6 text-white" aria-hidden />
          </Button>
          <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
        </div>
      }
      optionsContent={
        shuffledOptions.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrectSolution = option === currentLevel.solution;
          return (
            <Button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={answerStatus === "correct"}
              className={cn("text-base h-16 flex items-center justify-center gap-2 transition-all duration-300", isSelected && answerStatus === "correct" && "bg-green-500 hover:bg-green-600 border-2 border-green-700", isSelected && answerStatus === "incorrect" && "bg-red-500 hover:bg-red-500 border-2 border-red-700", !isSelected && answerStatus === "incorrect" && isCorrectSolution && "bg-green-200 text-green-800 border-2 border-green-400", answerStatus === "idle" && "bg-card text-card-foreground hover:bg-muted")}
            >
              {option}
              {isSelected && answerStatus === "correct" && <CheckCircle />}
              {isSelected && answerStatus === "incorrect" && <XCircle />}
            </Button>
          );
        })
      }
      nextButtonContent={
        answerStatus === "correct" && (
          <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            {t('next')}{" "}{dir === "rtl" ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        )
      }
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const WordChoiceScreen: React.FC = () => (
  <GameScreen useGameHook={useWordChoiceGame} GameComponent={WordChoiceGame} />
);

export default WordChoiceScreen;
