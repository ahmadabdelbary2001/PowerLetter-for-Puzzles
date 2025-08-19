// src/components/GameScreens/img-clue-game/ImgClueGameScreen.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/molecules/GameControls";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/layout/GameLayout";
import { useImageClueGame } from "../hooks/useImageClueGame";
import type { ImageLevel } from "../engine";

const ImgClueGameScreen: React.FC = () => {
  const { t, dir } = useTranslation();
  
  const {
    loading,
    levels,
    currentLevel,
    solution,
    letters,
    notification,
    audioRef,
    gameState,
    answerSlots,
    slotIndices,
    hintIndices,
    getAssetPath,
    playSound,
    onCheck,
    onLetterClick,
    onRemove,
    onClear,
    nextLevel,
    handleBack,
  } = useImageClueGame();

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

  const levelIndex = levels.findIndex((l: ImageLevel) => l.id === currentLevel.id);

  return (
    <GameLayout title={t.imageClueTitle} levelIndex={levelIndex} onBack={handleBack}>
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <img src={getAssetPath(currentLevel.image)} alt={solution} className="max-h-full max-w-full object-contain" />
        <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
          <Volume2 className="h-6 w-6 text-white" />
        </Button>
        <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
      </div>

      <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
      <LetterGrid letters={letters} selectedIndices={slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={gameState !== 'playing'} hintIndices={hintIndices} />
      
      {notification && (
        <div role="status" className={`text-center p-3 rounded-lg text-lg font-bold ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.message}
        </div>
      )}

      {gameState === 'won' ? (
        <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
          {t.next} {dir === 'rtl' ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
        </Button>
      ) : (
        <GameControls
          onRemoveLetter={onRemove}
          onClearAnswer={onClear}
          onCheckAnswer={onCheck}
          canRemove={slotIndices.some(i => i !== null)}
          canClear={slotIndices.some(i => i !== null)}
          canCheck={answerSlots.every(ch => ch !== '')}
          gameState={gameState as 'playing' | 'failed'}
          labels={{ remove: t.remove, clear: t.clear, check: t.check, hint: '', showSolution: '', reset: '', prev: '', next: '' }}
          isKidsMode={true}
        />
      )}
    </GameLayout>
  );
};

export default ImgClueGameScreen;
