// src/features/clue-game/components/ClueGameScreen.tsx
/**
 * ClueGameScreen component - Main game screen for the word clue puzzle game
 * Displays a clue and allows players to guess the solution by selecting letters
 * Shows game controls, feedback on wrong answers, and game status notifications
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/templates/GameLayout";
import { useClueGame } from "../hooks/useClueGame";
import { Notification } from "@/components/atoms/Notification";

/**
 * Main component for the Clue Game interface
 * Manages game state rendering and user interactions
 */
const ClueGameScreen: React.FC = () => {
  // Get translation function for localized text
  const { t } = useTranslation();

  // Destructure game state and handler functions from the useClueGame hook
  const {
    loading,
    currentLevel,
    solution,
    letters,
    notification,
    wrongAnswers,
    gameState,
    answerSlots,
    slotIndices,
    hintIndices,
    currentLevelIndex,
    levels,
    onCheck,
    onShow,
    onLetterClick,
    onRemove,
    onClear,
    onHint,
    nextLevel,
    prevLevel,
    handleBack,
    resetLevel,
    canRemove,
    canClear,
    canCheck,
    canHint,
  } = useClueGame();

  // Show loading state while levels are being loaded
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  // Show error state if no levels could be loaded
  if (!currentLevel || currentLevel.solution === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Notification mapping: transform to Notification props if present
  const notifMessage = notification?.message ?? null;
  const notifType = (notification?.type ?? "info") as "success" | "error" | "warning" | "info";

  // Main game UI
  return (
    <GameLayout
      title={currentLevel.clue}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
    >
      {/* Shared Notification (top-centered) */}
      {notifMessage && <Notification message={notifMessage} type={notifType} />}

      {/* Solution boxes showing current progress */}
      <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
      {/* Letter grid for selecting letters */}
      <LetterGrid letters={letters} selectedIndices={slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={gameState !== 'playing'} hintIndices={hintIndices} />

      {/* Display wrong answers if any */}
      {wrongAnswers.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">{t.wrongAttempts}:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {wrongAnswers.map((answer, index) => <Badge key={index} variant="destructive" className="text-xs py-1">{answer}</Badge>)}
          </div>
        </div>
      )}

      {/* Game controls for player actions */}
      <GameControls
        onRemoveLetter={onRemove}
        onClearAnswer={onClear}
        onCheckAnswer={onCheck}
        onHint={onHint}
        onShowSolution={onShow}
        onReset={resetLevel}
        onPrevLevel={prevLevel}
        onNextLevel={nextLevel}
        canRemove={canRemove}
        canClear={canClear}
        canCheck={canCheck}
        canHint={canHint}
        canPrev={currentLevelIndex > 0}
        canNext={currentLevelIndex < levels.length - 1}
        gameState={gameState}
        isKidsMode={false}
        labels={{ remove: t.remove, clear: t.clear, check: t.check, hint: t.hint, showSolution: t.showSolution, reset: t.reset, prev: t.prev, next: t.next }}
      />
    </GameLayout>
  );
};

export default ClueGameScreen;
