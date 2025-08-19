// src/features/clue-game/components/ClueGameScreen.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from "@/components/templates/GameLayout";
import { useClueGame } from "../hooks/useClueGame";
// FIX: Removed unused useGameMode import

const ClueGameScreen: React.FC = () => {
  const { t } = useTranslation();
  // FIX: Removed unused gameMode variable

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
    // FIX: Removed unused handleRevealOrListSolutions
  } = useClueGame();

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

  return (
    <GameLayout title={currentLevel.clue} levelIndex={currentLevelIndex} onBack={handleBack}>
      <div className="absolute top-4 right-4">
        <Badge variant={currentLevel.difficulty === 'easy' ? 'default' : currentLevel.difficulty === 'medium' ? 'secondary' : 'destructive'}>
          {t[currentLevel.difficulty]}
        </Badge>
      </div>

      <SolutionBoxes solution={solution} currentWord={answerSlots.join('')} />
      <LetterGrid letters={letters} selectedIndices={slotIndices.filter(i => i !== null) as number[]} onLetterClick={onLetterClick} disabled={gameState !== 'playing'} hintIndices={hintIndices} />
      
      {wrongAnswers.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-muted-foreground mb-1">{t.wrongAttempts}:</p>
          <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
            {wrongAnswers.map((answer, index) => <Badge key={index} variant="destructive" className="text-xs py-1">{answer}</Badge>)}
          </div>
        </div>
      )}

      {notification && (
        <div role="status" className={`text-center p-3 rounded-lg font-semibold ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {notification.message}
        </div>
      )}

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

      {/* The solver button was removed in the previous step, so no need for the handleRevealOrListSolutions function */}
    </GameLayout>
  );
};

export default ClueGameScreen;
