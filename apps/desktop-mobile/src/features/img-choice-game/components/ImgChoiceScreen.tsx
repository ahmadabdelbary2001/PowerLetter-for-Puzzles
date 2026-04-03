// src/features/img-choice-game/components/ImgChoiceScreen.tsx
/**
 * ImgChoiceScreen – Main screen for the image choice game (kids mode).
 * This component is now wrapped by the `GameScreen` HOC, which handles all
 * loading and error states. This file is only responsible for the game's specific UI.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useImgChoiceGame } from "@/features/img-choice-game/hooks/useImgChoiceGame";
import { cn } from "@/lib/utils";
import { MultipleChoiceLayout } from "@/components/templates/MultipleChoiceLayout";
import { GameScreen } from "@/components/organisms/GameScreen"; // Import the HOC

// 1. Define the pure UI component. It receives all props from the hook.
const ImgChoiceGame: React.FC<ReturnType<typeof useImgChoiceGame>> = ({
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
      title={t('imgChoiceTitle', { ns: 'games' })}
      levelIndex={0}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
      promptContent={
        <div className="relative bg-card rounded-lg p-6 flex items-center justify-center">
          <div className="text-3xl font-bold">{currentLevel.word}</div>
          {currentLevel.sound && (
            <>
              <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70" aria-label={t('playSound')}>
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
              className={cn("text-base h-36 flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden p-0", isSelected && answerStatus === "correct" && "ring-4 ring-green-500", isSelected && answerStatus === "incorrect" && "ring-4 ring-red-500", !isSelected && answerStatus === "incorrect" && isCorrect && "bg-green-200 text-green-800 ring-2 ring-green-400", answerStatus === "idle" && "bg-card text-card-foreground hover:bg-muted")}
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
            {t('next')}{" "}{dir === "rtl" ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        )
      }
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const ImgChoiceScreen: React.FC = () => (
  <GameScreen useGameHook={useImgChoiceGame} GameComponent={ImgChoiceGame} />
);

export default ImgChoiceScreen;
