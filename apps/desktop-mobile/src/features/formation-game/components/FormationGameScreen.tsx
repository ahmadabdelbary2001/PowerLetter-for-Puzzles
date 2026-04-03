// src/features/formation-game/components/FormationGameScreen.tsx
/**
 * @description The main UI component for the Word Formation Challenge.
 * It is now a pure presentational component wrapped by the `GameScreen` HOC,
 * which handles all loading and error states.
 */
import React from 'react';
import { useFormationGame } from '../hooks/useFormationGame';
import { RotateCcw, Check, Lightbulb } from 'lucide-react';
import { CrosswordGrid } from '@/components/molecules/CrosswordGrid';
import { LetterCircle } from '@/components/molecules/LetterCircle';
import { GameButton } from '@/components/atoms/GameButton';
import { WordFormationLayout } from '@/components/templates/WordFormationLayout';
import { GameScreen } from '@/components/organisms/GameScreen'; // Import the HOC

// 1. Define the pure UI component. It receives all props from the hook.
const FormationGame: React.FC<ReturnType<typeof useFormationGame>> = ({
  currentLevel,
  currentLevelIndex,
  letters,
  currentInput,
  revealedCells,
  notification,
  onClearNotification,
  usedLetterIndices,
  handleBack,
  onLetterSelect,
  onRemoveLast,
  onShuffle,
  onCheckWord,
  onHint,
  t,
  instructions,
}) => {
  return (
    <WordFormationLayout
      title={t('formationTitle', { ns: 'games' })}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
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
            {t('remove')}
          </GameButton>
          <GameButton
            variant="outline"
            onClick={onHint}
            disabled={revealedCells.size >= currentLevel.grid.length}
            icon={Lightbulb}
            className="flex-1 min-w-[80px] sm:min-w-[100px] py-1.5 sm:py-2 h-auto text-xs sm:text-sm px-2"
          >
            {t('hint')}
          </GameButton>
          <GameButton
            isPrimary={true}
            onClick={onCheckWord}
            disabled={currentInput.length < 2}
            icon={Check}
            className="flex-1 min-w-[120px] sm:min-w-[160px] py-2 sm:py-2.5 h-auto text-xs sm:text-sm px-3.5 text-center whitespace-nowrap font-semibold"
          >
            {t('check')}
          </GameButton>
        </>
      }
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const FormationGameScreen: React.FC = () => (
  <GameScreen useGameHook={useFormationGame} GameComponent={FormationGame} />
);

export default FormationGameScreen;
