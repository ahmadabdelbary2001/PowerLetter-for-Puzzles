// src/features/img-choice-game/components/ImgChoiceScreen.tsx
/**
 * ImgChoiceScreen – Main screen for the image choice game (kids mode).
 * This component uses the shared MultipleChoiceLayout to structure the page,
 * passing its game-specific elements (text prompt, image options) as content slots.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useImgChoiceGame } from "@/features/img-choice-game/hooks/useImgChoiceGame";
import { cn } from "@/lib/utils";
import { useInstructions } from "@/hooks/useInstructions";
import { MultipleChoiceLayout } from "@/components/templates/MultipleChoiceLayout";

const ImgChoiceScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  // Get instructions
  const rawInstructions = useInstructions("ImgChoice");
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? "",
        description: rawInstructions.description ?? "",
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  // Get all state and handlers from the game's specific hook
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
  } = useImgChoiceGame();

  // Show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t.loading}...</p>
      </div>
    );
  }

  // Handle no levels or error state
  if (!currentLevel || currentLevel.solution === "ERROR") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Determine notification message and type
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
      title={t.ImgChoiceTitle ?? t.findThePictureTitle ?? "Find the Image"}
      levelIndex={0} // This game doesn't show a level index, so 0 is fine
      onBack={handleBack}
      instructions={instructions}
      notificationMessage={notifMessage}
      notificationType={notifType}
      // Pass game-specific content into the layout's slots
      promptContent={
        <div className="relative bg-card rounded-lg p-6 flex items-center justify-center">
          <div className="text-3xl font-bold">{currentLevel.word}</div>
          {currentLevel.sound && (
            <>
              <Button
                size="icon"
                onClick={playSound}
                className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70"
                aria-label={t.playSound ?? "Play sound"}
              >
                <Volume2 className="h-6 w-6 text-white" aria-hidden />
              </Button>
              <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
            </>
          )}
        </div>
      }
      optionsContent={
        shuffledOptions.map((imgPath) => {
          const isSelected = selectedOption === imgPath;
          const isCorrect = imgPath === currentLevel.solution;
          return (
            <Button
              key={imgPath}
              onClick={() => handleOptionClick(imgPath)}
              disabled={answerStatus === "correct"}
              className={cn(
                "text-base h-36 flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden p-0",
                isSelected && answerStatus === "correct" && "ring-4 ring-green-500",
                isSelected && answerStatus === "incorrect" && "ring-4 ring-red-500",
                !isSelected && answerStatus === "incorrect" && isCorrect && "bg-green-200 text-green-800 ring-2 ring-green-400",
                answerStatus === "idle" && "bg-card text-card-foreground hover:bg-muted"
              )}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <img src={getAssetPath(imgPath)} alt="" className="max-h-full max-w-full object-contain" />
              </div>
              {isSelected && answerStatus === "correct" && <CheckCircle className="absolute top-2 right-2 text-green-600" />}
              {isSelected && answerStatus === "incorrect" && <XCircle className="absolute top-2 right-2 text-red-600" />}
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

export default ImgChoiceScreen;
