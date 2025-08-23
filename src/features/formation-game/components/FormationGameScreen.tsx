// src/features/formation-game/components/FormationGameScreen.tsx
/**
 * @description The main UI component for the Word Formation Challenge.
 * It now composes atomic and molecular components and uses a simplified, custom control bar.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { useFormationGame } from '../hooks/useFormationGame';
import { useTranslation } from '@/hooks/useTranslation';
import { RotateCcw, Check, Lightbulb } from 'lucide-react';
import { CrosswordGrid } from '@/components/molecules/CrosswordGrid';
import { LetterCircle } from '@/components/molecules/LetterCircle';
import { GameButton } from '@/components/atoms/GameButton'; // FIX: Import GameButton for the controls

const FormationGameScreen: React.FC = () => {
  const { t } = useTranslation();
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
    >
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <CrosswordGrid grid={currentLevel.grid} revealedCells={revealedCells} />

        <div className="h-8 text-center font-semibold text-primary">
          {notification}
        </div>

        <div className="h-12 w-full max-w-xs bg-muted rounded-lg flex items-center justify-center text-2xl font-bold tracking-widest">
          {currentInput || <span className="text-muted-foreground/50">{t.typeAWord || "Type a word"}</span>}
        </div>

        <LetterCircle
          letters={letters}
          usedLetterIndices={Array.from(usedLetterIndices)}
          onLetterSelect={onLetterSelect}
          onShuffle={onShuffle}
        />

        {/* FIX: Replaced GameControls with a simple, dedicated control bar */}
        <div className="flex w-full max-w-xs justify-center gap-2 sm:gap-4">
          <GameButton
            variant="outline"
            onClick={onRemoveLast}
            disabled={currentInput.length === 0}
            icon={RotateCcw}
            className="flex-1"
          >
            {t.remove}
          </GameButton>
          <GameButton
            variant="outline"
            onClick={onHint}
            disabled={revealedCells.size >= currentLevel.grid.length}
            icon={Lightbulb}
            className="flex-1"
          >
            {t.hint}
          </GameButton>
          <GameButton
            isPrimary={true}
            onClick={onCheckWord}
            disabled={currentInput.length < 2}
            icon={Check}
            className="flex-1"
          >
            {t.check}
          </GameButton>
        </div>
      </div>
    </GameLayout>
  );
};

export default FormationGameScreen;
