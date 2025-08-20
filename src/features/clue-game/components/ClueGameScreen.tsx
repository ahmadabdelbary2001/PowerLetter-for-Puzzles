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

/**
 * Main component for the Clue Game interface
 * Manages game state rendering and user interactions
 */
const ClueGameScreen: React.FC = () => {
  // Get translation function for localized text
  const { t } = useTranslation();

  // Destructure game state and handler functions from the useClueGame hook
  const {
    loading,              // Loading state for level data
    currentLevel,         // Current level data including clue and solution
    solution,             // Solution word for the current level
    letters,              // Available letter options
    notification,         // Game status notifications
    wrongAnswers,         // Array of incorrect answers submitted
    gameState,            // Current game state (playing, won, failed)
    answerSlots,          // Current letters selected by the player
    slotIndices,          // Indices of selected letters
    hintIndices,          // Indices of letters revealed as hints
    currentLevelIndex,    // Index of current level in the levels array
    levels,               // Array of all loaded levels
    onCheck,              // Function to check if current answer is correct
    onShow,               // Function to show the solution
    onLetterClick,        // Function to handle letter selection
    onRemove,             // Function to remove last letter
    onClear,              // Function to clear all letters
    onHint,               // Function to request a hint
    nextLevel,            // Function to navigate to next level
    prevLevel,            // Function to navigate to previous level
    handleBack,           // Function to navigate back to game selection
    resetLevel,           // Function to reset the current level
    canRemove,            // Flag indicating if remove action is available
    canClear,             // Flag indicating if clear action is available
    canCheck,             // Flag indicating if check action is available
    canHint,              // Flag indicating if hint action is available
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

  // Main game UI
  return (
    <GameLayout title={currentLevel.clue} levelIndex={currentLevelIndex} onBack={handleBack}>
      {/* Difficulty badge in top right corner */}
      <div className="absolute top-4 right-4">
        <Badge variant={currentLevel.difficulty === 'easy' ? 'default' : currentLevel.difficulty === 'medium' ? 'secondary' : 'destructive'}>
          {t[currentLevel.difficulty]}
        </Badge>
      </div>

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

      {/* Notification area for game status messages */}
      {notification && (
        <div role="status" className={`text-center p-3 rounded-lg font-semibold ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.message}
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