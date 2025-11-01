// src/features/formation-game/components/FormationGameScreen.tsx
/**
 * @description The main UI component for the Word Formation Challenge.
 * Features a compact, responsive layout with an integrated word display and optimized spacing.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { useFormationGame } from '../hooks/useFormationGame';
import { useTranslation } from "@/hooks/useTranslation";
import { RotateCcw, Check, Lightbulb } from 'lucide-react';
import { CrosswordGrid } from '@/components/molecules/CrosswordGrid';
import { LetterCircle } from '@/components/molecules/LetterCircle';
import { GameButton } from '@/components/atoms/GameButton';
import { Notification } from '@/components/atoms/Notification';
import { useFormationInstructions } from '../instructions';

const FormationGameScreen: React.FC = () => {
  const { t } = useTranslation();
  const instructions = useFormationInstructions();
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
  } = useFormationGame();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }

  if (!currentLevel || currentLevel.baseLetters === 'ERROR') {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <GameButton onClick={handleBack}>{t.back}</GameButton>
      </div>
    );
  }

  return (
    <GameLayout
      title={t.formationTitle}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
    >
      {/* Shared Notification (top-centered) */}
      {notification && <Notification message={notification} type="info" />}

      {/* FIX: Reduced vertical gaps for a more compact layout. */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        {/* The crossword grid. */}
        <CrosswordGrid grid={currentLevel.grid} revealedCells={revealedCells} />

        {/* Display for the current word being formed */}
        <div className="h-8 sm:h-10 flex justify-center items-center mb-1 sm:mb-2">
          <div className="text-2xl sm:text-3xl font-bold text-primary tracking-wider">
            {currentInput || "..."}
          </div>
        </div>

        {/* The circular letter selection wheel. */}
        <LetterCircle
          letters={letters}
          usedLetterIndices={Array.from(usedLetterIndices)}
          onLetterSelect={onLetterSelect}
          onShuffle={onShuffle}
        />

        {/* FIX: Control bar with responsive button sizes and tighter spacing. */}
        <div className="flex w-full max-w-xs justify-center gap-1 sm:gap-2 px-1 flex-wrap sm:flex-nowrap items-center">
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
        </div>
      </div>
    </GameLayout>
  );
};

export default FormationGameScreen;
