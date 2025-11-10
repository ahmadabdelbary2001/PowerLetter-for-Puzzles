// src/features/img-clue-game/components/ImgClueGameScreen.tsx
/**
 * ImgClueGameScreen component - Main game screen for the image clue puzzle game.
 * This component is now wrapped by the `GameScreen` HOC, which handles all
 * loading and error states, keeping this file focused on the game's specific UI.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useImageClueGame } from "../hooks/useImageClueGame";
import { ClueGameLayout } from "@/components/templates/ClueGameLayout";
import { GameScreen } from "@/components/organisms/GameScreen"; // Import the HOC

// 1. Define the pure UI component.
const ImgClueGame: React.FC<ReturnType<typeof useImageClueGame>> = ({
  currentLevel,
  solution,
  notification,
  onClearNotification,
  wrongAnswers,
  gameState,
  currentLevelIndex,
  levels,
  audioRef,
  getAssetPath,
  playSound,
  onCheck,
  onLetterClick,
  onRemove,
  onClear,
  nextLevel,
  prevLevel,
  handleBack,
  resetLevel,
  canRemove,
  canClear,
  canCheck,
  gameMode,
  t,
  i18n,
  instructions,
}) => {
  const dir = i18n.dir();
  const { answerSlots, slotIndices, hintIndices } = gameState;

  return (
    <ClueGameLayout
      title={t('imgClueTitle', { ns: 'games' })}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
      layoutType="image"
      promptContent={
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <img src={getAssetPath(currentLevel.image)} alt={solution} className="max-h-full max-w-full object-contain" />
          <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
            <Volume2 className="h-6 w-6 text-white" />
          </Button>
          <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
        </div>
      }
      solutionContent={<SolutionBoxes solution={solution} currentWord={answerSlots.join("")} />}
      letterOptionsContent={
        <LetterGrid
          letters={gameState.letters}
          selectedIndices={slotIndices.filter((i): i is number => i !== null)}
          onLetterClick={onLetterClick}
          disabled={gameState.gameState !== "playing"}
          hintIndices={hintIndices}
        />
      }
      wrongAnswersContent={
        wrongAnswers.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">{t('wrongAttempts')}:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {wrongAnswers.map((answer, index) => <Badge key={index} variant="destructive">{answer}</Badge>)}
            </div>
          </div>
        )
      }
      gameControlsContent={
        gameState.gameState === "won" && gameMode !== "competitive" ? (
          <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            {t('next')}{" "}{dir === "rtl" ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
          </Button>
        ) : (
          <GameControls
            onRemoveLetter={onRemove}
            onClearAnswer={onClear}
            onCheckAnswer={onCheck}
            onReset={resetLevel}
            onPrevLevel={prevLevel}
            onNextLevel={nextLevel}
            canRemove={canRemove}
            canClear={canClear}
            canCheck={canCheck}
            canPrev={currentLevelIndex > 0}
            canNext={currentLevelIndex < levels.length - 1}
            gameState={gameState.gameState}
            gameMode={gameMode}
            isKidsMode={true}
            labels={{ remove: t('remove'), clear: t('clear'), check: t('check'), hint: t('hint'), showSolution: t('showSolution'), reset: t('reset'), prev: t('prev'), next: t('next') }}
          />
        )
      }
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const ImgClueGameScreen: React.FC = () => (
  <GameScreen useGameHook={useImageClueGame} GameComponent={ImgClueGame} />
);

export default ImgClueGameScreen;
