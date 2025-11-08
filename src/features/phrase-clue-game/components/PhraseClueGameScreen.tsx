// src/features/phrase-clue-game/components/PhraseClueGameScreen.tsx
/**
 * Main component for the Phrase Clue Game interface.
 * This component is now a "presentational" component that assembles the UI
 * using the shared ClueGameLayout and passes down the state and logic
 * from the usePhraseClueGame hook.
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { usePhraseClueGame } from "../hooks/usePhraseClueGame";
import { ClueGameLayout } from "@/components/templates/ClueGameLayout";

const PhraseClueGameScreen: React.FC = () => {
  // All game logic is now neatly contained in this hook.
  const {
    loading,
    currentLevel,
    solution,
    notification,
    wrongAnswers,
    gameState, // This now correctly contains the full reducer state
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
    gameMode,
    t,
    instructions,
  } = usePhraseClueGame();

  // Handle loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t.loading}...</p>
      </div>
    );
  }

  // Handle error state
  if (!currentLevel || currentLevel.solution === "ERROR") {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  // Destructure properties from the correctly typed gameState.
  const { answerSlots, slotIndices, hintIndices } = gameState;

  // Use the ClueGameLayout to render the UI.
  return (
    <ClueGameLayout
      title={currentLevel.clue}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions} // This now matches the expected type
      notification={notification}
      promptContent={null}
      solutionContent={<SolutionBoxes solution={solution} currentWord={answerSlots.join("")} />}
      letterOptionsContent={
        <LetterGrid
          letters={gameState.letters}
          selectedIndices={slotIndices.filter((i: number | null): i is number => i !== null)}
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
          gameState={gameState.gameState}
          gameMode={gameMode}
          isKidsMode={false}
          labels={{
            remove: t.remove,
            clear: t.clear,
            check: t.check,
            hint: t.hint,
            showSolution: t.showSolution,
            reset: t.reset,
            prev: t.prev,
            next: t.next,
          }}
        />
      }
    />
  );
};

export default PhraseClueGameScreen;
