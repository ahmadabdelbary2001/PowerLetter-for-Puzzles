// src/features/word-choice-game/components/WordChoiceScreen.tsx
/**
 * This component implements the UI for the Word Choice game.
 * It uses the shared MultipleChoiceLayout to structure the page, passing
 * its game-specific elements (image prompt, word options) as content slots.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useWordChoiceGame } from "@/features/word-choice-game/hooks/useWordChoiceGame";
import { cn } from "@/lib/utils";
import { useInstructions } from "@/hooks/useInstructions";
import { MultipleChoiceLayout } from "@/components/templates/MultipleChoiceLayout";

const WordChoiceScreen: React.FC = () => {
  // Get translation functions and text direction
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  // Get instructions
  const rawInstructions = useInstructions("wordChoice");
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? "",
        description: rawInstructions.description ?? "",
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  // Extract all necessary state and functions from the custom hook
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

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t.loading}...</p>
      </div>
    );
  }

  // Render error state
  if (!currentLevel || currentLevel.solution === "ERROR") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Build notification for success/incorrect attempts
  const notifMessage =
    answerStatus === "correct"
      ? t.congrats ?? "Correct!"
      : answerStatus === "incorrect"
      ? t.wrongAnswer ?? "Wrong! Try again"
      : null;
  const notifType = answerStatus === "correct" ? "success" : "error";

  // --- Use the new MultipleChoiceLayout ---
  return (
    <MultipleChoiceLayout
      // Pass standard layout props
      title={t.wordChoiceTitle ?? "Word Choice"}
      levelIndex={0} // Temporary value - should be updated based on actual level index
      onBack={handleBack}
      instructions={instructions}
      notificationMessage={notifMessage}
      notificationType={notifType}
      // Pass game-specific content into the layout's slots
      promptContent={
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <img src={getAssetPath(currentLevel.image)} alt="Guess the word" className="max-h-full max-w-full object-contain" />
          <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70" aria-label={t.playSound ?? "Play sound"}>
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
              className={cn(
                "text-base h-16 flex items-center justify-center gap-2 transition-all duration-300",
                isSelected && answerStatus === "correct" && "bg-green-500 hover:bg-green-600 border-2 border-green-700",
                isSelected && answerStatus === "incorrect" && "bg-red-500 hover:bg-red-500 border-2 border-red-700",
                !isSelected && answerStatus === "incorrect" && isCorrectSolution && "bg-green-200 text-green-800 border-2 border-green-400",
                answerStatus === "idle" && "bg-card text-card-foreground hover:bg-muted"
              )}
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
            {t.next}{" "}
            {dir === "rtl" ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        )
      }
    />
  );
};

export default WordChoiceScreen;
