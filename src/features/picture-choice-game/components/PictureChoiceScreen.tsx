// src/features/picture-choice-game/components/PictureChoiceScreen.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Volume2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/templates/GameLayout";
import { usePictureChoiceGame } from "@/features/picture-choice-game/hooks/usePictureChoiceGame";
import { cn } from "@/lib/utils";
import { Notification } from "@/components/atoms/Notification";
import { usePictureChoiceInstructions } from "@/features/picture-choice-game/instructions";

const PictureChoiceScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const instructions = usePictureChoiceInstructions();

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
  } = usePictureChoiceGame();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t.loading}...</p>
      </div>
    );
  }

  if (!currentLevel || currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  const showNotif = answerStatus !== 'idle';
  const notifMessage = answerStatus === 'correct' ? (t.congrats ?? "Correct!") :
                       answerStatus === 'incorrect' ? (t.wrongAnswer ?? "Wrong! Try again") : "";
  const notifType = answerStatus === 'correct' ? 'success' : 'error';

  return (
    <GameLayout
      title={t.pictureChoiceTitle ?? t.findThePictureTitle ?? "Find the Picture"}
      levelIndex={0}
      onBack={handleBack}
      layoutType="image"
      instructions={instructions}
    >
      {showNotif && (
        <Notification message={notifMessage} type={notifType} duration={1000} />
      )}

      {/* Word (text) and optional sound */}
      <div className="relative bg-card rounded-lg p-6 flex items-center justify-center">
        <div className="text-3xl font-bold">{currentLevel.word}</div>

        {currentLevel.sound && (
          <>
            <Button
              size="icon"
              onClick={playSound}
              className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70"
              aria-label={t.playSound ?? 'Play sound'} // accessible name for icon-only button
            >
              <Volume2 className="h-6 w-6 text-white" aria-hidden />
            </Button>
            <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
          </>
        )}
      </div>

      {/* Image options grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {shuffledOptions.map((imgPath) => {
          const isSelected = selectedOption === imgPath;
          const isCorrect = imgPath === currentLevel.solution;

          return (
            <Button
              key={imgPath}
              onClick={() => handleOptionClick(imgPath)}
              disabled={answerStatus === 'correct'}
              className={cn(
                "text-base h-36 flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden p-0",
                isSelected && answerStatus === 'correct' && "ring-4 ring-green-500",
                isSelected && answerStatus === 'incorrect' && "ring-4 ring-red-500",
                !isSelected && answerStatus === 'incorrect' && isCorrect && "bg-green-200 text-green-800 ring-2 ring-green-400",
                answerStatus === 'idle' && "bg-card text-card-foreground hover:bg-muted"
              )}
            >
              <div className="w-full h-full flex items-center justify-center p-2">
                <img src={getAssetPath(imgPath)} alt="" className="max-h-full max-w-full object-contain" />
              </div>

              {isSelected && answerStatus === 'correct' && <CheckCircle className="absolute top-2 right-2" />}
              {isSelected && answerStatus === 'incorrect' && <XCircle className="absolute top-2 right-2" />}
            </Button>
          );
        })}
      </div>

      {/* Next button */}
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

export default PictureChoiceScreen;
