// src/features/phrase-clue-game/components/PhraseClueGameScreen.tsx
/**
 * Main component for the Phrase Clue Game interface.
 * This component is now wrapped by the `GameScreen` HOC, which handles all
 * loading and error states, keeping this file focused on the game's specific UI.
 */
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SolutionBoxes } from "@/components/molecules/SolutionBoxes";
import { LetterGrid } from "@/components/molecules/LetterGrid";
import GameControls from "@/components/organisms/GameControls";
import { usePhraseClueGame } from "../hooks/usePhraseClueGame";
import { ClueGameLayout } from "@/components/templates/ClueGameLayout";
import { GameScreen } from "@/components/organisms/GameScreen"; // Import the HOC

// 1. Define the pure UI component.
const PhraseClueGame: React.FC<ReturnType<typeof usePhraseClueGame>> = ({
  currentLevel,
  solution,
  notification,
  onClearNotification,
  wrongAnswers,
  gameState,
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
}) => {
  const { answerSlots, slotIndices, hintIndices } = gameState;

  return (
    <ClueGameLayout
      title={currentLevel.clue}
      levelIndex={currentLevelIndex}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
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
            <p className="text-sm text-muted-foreground mb-1">{t('wrongAttempts')}:</p>
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
            remove: t('remove'),
            clear: t('clear'),
            check: t('check'),
            hint: t('hint'),
            showSolution: t('showSolution'),
            reset: t('reset'),
            prev: t('prev'),
            next: t('next'),
          }}
        />
      }
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const PhraseClueGameScreen: React.FC = () => (
  <GameScreen useGameHook={usePhraseClueGame} GameComponent={PhraseClueGame} />
);

export default PhraseClueGameScreen;
