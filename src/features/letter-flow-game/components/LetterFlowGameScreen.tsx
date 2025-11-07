// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * @description The main UI component for the Letter Flow game.
 * This component now uses the shared FlowGameLayout to structure the page,
 * passing its game-specific elements as content slots.
 */
import React from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import { LetterFlowBoard } from '@/components/molecules/LetterFlowBoard';
import { FoundWords } from '@/components/molecules/FoundWords';
import GameControls from '@/components/organisms/GameControls';
import { GameProgress } from '@/components/molecules/GameProgress';
import { useTranslation } from "@/hooks/useTranslation";
import { useInstructions } from '@/hooks/useInstructions';
import { useGameMode } from '@/hooks/useGameMode';
import { usePassiveTouchFix } from '../hooks/usePassiveTouchFix';
import { Button } from '@/components/ui/button';
import { FlowGameLayout } from '@/components/templates/FlowGameLayout';
import type { LetterFlowLevel } from '../engine';

const LetterFlowGameScreen: React.FC = () => {
  const { t } = useTranslation();
  const { gameMode } = useGameMode();

  const rawInstructions = useInstructions('letterFlow');
  const instructions = rawInstructions ? { title: rawInstructions.title ?? '', description: rawInstructions.description ?? '', steps: rawInstructions.steps ?? [] } : undefined;
  usePassiveTouchFix();

  // --- Destructure `nextLevel` from the hook ---
  const {
    loading,
    currentLevel,
    board,
    selectedPath,
    foundWords,
    notification,
    gameState,
    activeLetter,
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    onHint,
    onUndo,
    onReset,
    clearSelection,
    currentLevelIndex,
    nextLevel, // Now available to be passed down
  } = useLetterFlowGame();

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p>{t.loading}...</p></div>;
  }
  if (!currentLevel) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 text-center">
        <p className="text-xl font-semibold">{t.noLevelsFound}</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    );
  }

  const totalWords = Math.floor(((currentLevel as LetterFlowLevel)?.endpoints.length ?? 0) / 2);

  return (
    <FlowGameLayout
      title={t.letterFlowTitle ?? currentLevel.id}
      levelIndex={currentLevelIndex ?? 0}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
      notification={notification}
      boardContent={
        <LetterFlowBoard
          cells={board}
          selectedPath={selectedPath}
          foundWords={foundWords}
          activeLetter={activeLetter}
          onMouseDown={(cell) => handleMouseDown({ ...cell, isUsed: false })}
          onMouseEnter={(cell) => handleMouseEnter({ ...cell, isUsed: false })}
          onMouseUp={handleMouseUp}
        />
      }
      foundWordsContent={
        foundWords.length > 0 ? <FoundWords foundWords={foundWords} t={{ selected: t.selected }} /> : null
      }
      gameControlsContent={
        <GameControls
          onReset={onReset}
          onRemoveLetter={onUndo}
          onClearAnswer={clearSelection}
          onHint={onHint}
          // --- Pass the `nextLevel` function to the `onNextLevel` prop ---
          onNextLevel={nextLevel}
          canRemove={foundWords.length > 0}
          canClear={selectedPath.length > 0}
          canCheck={false}
          canNext={gameState === 'won'}
          canHint={foundWords.length < totalWords}
          gameState={gameState}
          gameMode={gameMode}
          isKidsMode={false}
          labels={{
            remove: t.undo,
            clear: t.clear,
            check: t.check,
            hint: t.hint,
            showSolution: t.showSolution,
            reset: t.reset,
            prev: t.prev,
            next: t.next,
          }}
          showOnly={['remove', 'hint', 'reset', 'next']}
        />
      }
      progressContent={
        <GameProgress
          foundWords={foundWords}
          totalWords={totalWords}
          t={{ selected: t.selected, of: t.of }}
        />
      }
    />
  );
};

export default LetterFlowGameScreen;
