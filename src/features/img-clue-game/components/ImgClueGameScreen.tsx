// src/features/img-clue-game/components/ImgClueGameScreen.tsx
/**
 * ImgClueGameScreen component - Main game screen for the image clue puzzle game.
 * This component now uses the shared ClueGameLayout to structure the page,
 * passing its game-specific elements (image prompt, solution boxes) as content slots.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useImageClueGame } from "../hooks/useImageClueGame";
import { useGameMode } from "@/hooks/useGameMode";
import { useInstructions } from "@/hooks/useInstructions";
import { ClueGameLayout } from "@/components/templates/ClueGameLayout";

const ImgClueGameScreen: React.FC = () => {
  // Get translations, instructions, and game mode
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const instructionsData = useInstructions("imageClue");
  const instructions = instructionsData ? {
    title: instructionsData.title,
    description: instructionsData.description ?? "",
    steps: instructionsData.steps ?? [],
  } : undefined;
  const { gameMode } = useGameMode();

  // Destructure all state and handlers from the hook
  const {
    loading,
    currentLevel,
    solution,
    letters,
    notification,
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
  } = useImageClueGame();

  // --- FIX: The loading and error handling logic is now more robust. ---

  // 1. Handle the initial loading state.
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  // 2. Handle the case where loading is finished but no valid level was found.
  // This check is now performed *before* any attempt to render the main UI.
  // This prevents the "Cannot read properties of undefined" crash.
  if (!currentLevel || currentLevel.solution === "ERROR") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Unchanged: Destructure properties from the gameState now that we know it's safe.
  const { answerSlots, slotIndices, hintIndices } = gameState;

  // If we reach this point, we know `currentLevel` is a valid object.
  return (
    <ClueGameLayout
      title={t.imageClueTitle}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      instructions={instructions}
      notification={notification}
      layoutType="image"
      // Pass game-specific content into the layout's slots
      promptContent={
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          {/* This line is now safe because we've already checked that `currentLevel` exists. */}
          <img src={getAssetPath(currentLevel.image)} alt={solution} className="max-h-full max-w-full object-contain" />
          <Button size="icon" onClick={playSound} className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70">
            <Volume2 className="h-6 w-6 text-white" />
          </Button>
          <audio ref={audioRef} src={getAssetPath(currentLevel.sound)} preload="auto" />
        </div>
      }
      solutionContent={
        <SolutionBoxes solution={solution} currentWord={answerSlots.join("")} />
      }
      letterOptionsContent={
        <LetterGrid
          letters={letters}
          selectedIndices={slotIndices.filter((i): i is number => i !== null)}
          onLetterClick={onLetterClick}
          disabled={gameState.gameState !== "playing"}
          hintIndices={hintIndices}
        />
      }
      wrongAnswersContent={
        wrongAnswers.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">{t.wrongAttempts}:</p>
            <div className="flex flex-wrap gap-1 justify-center">
              {wrongAnswers.map((answer, index) => <Badge key={index} variant="destructive">{answer}</Badge>)}
            </div>
          </div>
        )
      }
      gameControlsContent={
        // This logic correctly shows the "Next" button or the game controls.
        gameState.gameState === "won" && gameMode !== "competitive" ? (
          <Button onClick={nextLevel} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            {t.next}{" "}
            {dir === "rtl" ? <ArrowLeft className="ml-2" /> : <ArrowRight className="ml-2" />}
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
            labels={{ remove: t.remove, clear: t.clear, check: t.check, hint: t.hint, showSolution: t.showSolution, reset: t.reset, prev: t.prev, next: t.next }}
          />
        )
      }
    />
  );
};

export default ImgClueGameScreen;
