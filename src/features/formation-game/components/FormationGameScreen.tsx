// src/features/formation-game/components/FormationGameScreen.tsx
/**
 * @description The main UI component for the Word Formation Challenge.
 * It is now a "dumb" presentational component that receives all data and logic
 * from the `useFormationGame` hook.
 */
import React from 'react';
import { useFormationGame } from '../hooks/useFormationGame';
import { RotateCcw, Check, Lightbulb } from 'lucide-react';
import { CrosswordGrid } from '@/components/molecules/CrosswordGrid';
import { LetterCircle } from '@/components/molecules/LetterCircle';
import { GameButton } from '@/components/atoms/GameButton';
import { Button } from '@/components/ui/button';
import { WordFormationLayout } from '@/components/templates/WordFormationLayout';

const FormationGameScreen: React.FC = () => {
  // The hook now provides EVERYTHING the component needs.
  const {
    loading,
    currentLevel,
    currentLevelIndex,
    letters,
    currentInput,
    revealedCells,
    notification,
    usedLetterIndices,
    handleBack,
    onLetterSelect,
    onRemoveLast,
    onShuffle,
    onCheckWord,
    onHint,
    t,
    instructions,
  } = useFormationGame();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }
  if (!currentLevel || currentLevel.baseLetters === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  return (
    <WordFormationLayout
      title={t.formationTitle}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
      notificationMessage={notification}
      gridContent={
        <CrosswordGrid grid={currentLevel.grid} revealedCells={revealedCells} />
      }
      inputDisplayContent={
        <div className="text-2xl sm:text-3xl font-bold text-primary tracking-wider">
          {currentInput || "..."}
        </div>
      }
      letterSelectorContent={
        <LetterCircle
          letters={letters}
          usedLetterIndices={Array.from(usedLetterIndices)}
          onLetterSelect={onLetterSelect}
          onShuffle={onShuffle}
        />
      }
      gameControlsContent={
        <>
          <GameButton
            variant="outline"
            onClick={onRemoveLast}
            disabled={currentInput.length === 0}
            icon={RotateCcw}
            className="flex-1 min-w-[80px] sm:min-w-[100px] py-1.5 sm:py-2 h-auto text-xs sm:text-sm px-2"
          >
            {t.remove}
          </GameButton>
          <GameButton
            variant="outline"
            onClick={onHint}
            disabled={revealedCells.size >= currentLevel.grid.length}
            icon={Lightbulb}
            className="flex-1 min-w-[80px] sm:min-w-[100px] py-1.5 sm:py-2 h-auto text-xs sm:text-sm px-2"
          >
            {t.hint}
          </GameButton>
          <GameButton
            isPrimary={true}
            onClick={onCheckWord}
            disabled={currentInput.length < 2}
            icon={Check}
            className="flex-1 min-w-[120px] sm:min-w-[160px] py-2 sm:py-2.5 h-auto text-xs sm:text-sm px-3.5 text-center whitespace-nowrap font-semibold"
          >
            {t.check}
          </GameButton>
        </>
      }
    />
  );
};

export default FormationGameScreen;
