// src/features/img-clue-game/components/ImgClueGameScreen.tsx
/**
 * ImgClueGameScreen component - Main game screen for the image clue puzzle game for kids
 * Displays an image and audio clue, allowing children to guess the word by selecting letters
 * Features a simplified UI designed for young children with visual and audio cues
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { ArrowLeft, ArrowRight, Volume2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/templates/GameLayout";
import { useImageClueGame } from "../hooks/useImageClueGame";
import { useGameMode } from "@/hooks/useGameMode";
import { Notification } from "@/components/atoms/Notification";
import { useInstructions } from "@/hooks/useInstructions";

/**
 * Main component for the Image Clue Game interface
 * Manages game state rendering and user interactions for a kid-friendly experience
 */
const ImgClueGameScreen: React.FC = () => {
  // Get translation function and text direction for localization
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  // Get instructions data
  const instructionsData = useInstructions("imageClue");
  const instructions = instructionsData ? {
    title: instructionsData.title,
    description: instructionsData.description ?? "",
    steps: instructionsData.steps ?? [],
  } : undefined;

  // Get gameMode from the global state. This is what we need to pass down.
  const { gameMode } = useGameMode();

  // Destructure game state and handlers from the custom hook
  const {
    loading,
    currentLevel,
    solution,
    letters,
    notification,
    wrongAnswers,
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
    currentLevelIndex,
    canRemove,
    canClear,
    canCheck,
  } = useImageClueGame();

  // Loading and error states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t.loading}...</p>
      </div>
    );
  }
  if (!currentLevel || currentLevel.solution === "ERROR") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Notification mapping
  const notifMessage = notification?.message ?? null;
  const notifType = (notification?.type ?? "info") as "success" | "error" | "warning" | "info";

  // Main game UI
  return (
    <GameLayout
      title={t.imageClueTitle}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      layoutType="image"
      instructions={instructions}
    >
      {notifMessage && <Notification message={notifMessage} type={notifType} />}

      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <img
          src={getAssetPath(currentLevel.image)}
          alt={solution}
          className="max-h-full max-w-full object-contain"
        />
        <Button
          size="icon"
          onClick={playSound}
          className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70"
        >
          <Volume2 className="h-6 w-6 text-white" />
        </Button>
        <audio
          ref={audioRef}
          src={getAssetPath(currentLevel.sound)}
          preload="auto"
        />
      </div>

      <SolutionBoxes solution={solution} currentWord={answerSlots.join("")} />

      <LetterGrid
        letters={letters}
        selectedIndices={
          slotIndices.filter((i) => i !== null && i !== undefined) as number[]
        }
        onLetterClick={onLetterClick}
        disabled={gameState !== "playing"}
        hintIndices={hintIndices}
      />

      {wrongAnswers && wrongAnswers.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">
            {t.wrongAttempts}:
          </p>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {wrongAnswers.map((answer, index) => (
              <Badge
                key={index}
                variant="destructive"
                className="text-xs py-1"
              >
                {answer}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Conditional rendering based on game state */}
      {gameState === "won" ? (
        // Show Next button in Solo mode only
        gameMode !== "competitive" ? (
          <Button
            onClick={nextLevel}
            className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
          >
            {t.next}{" "}
            {dir === "rtl" ? (
              <ArrowLeft className="ml-2" />
            ) : (
              <ArrowRight className="ml-2" />
            )}
          </Button>
        ) : null
      ) : (
        // Show game controls when still playing / failed
        <GameControls
          onRemoveLetter={onRemove}
          onClearAnswer={onClear}
          onCheckAnswer={onCheck}
          canRemove={canRemove}
          canClear={canClear}
          canCheck={canCheck}
          gameState={gameState as "playing" | "failed"}
          // --- FIX: Pass the 'gameMode' prop ---
          gameMode={gameMode}
          labels={{
            remove: t.remove,
            clear: t.clear,
            check: t.check,
            hint: "",
            showSolution: "",
            reset: "",
            prev: "",
            next: "",
          }}
          isKidsMode={true}
        />
      )}
    </GameLayout>
  );
};

export default ImgClueGameScreen;
