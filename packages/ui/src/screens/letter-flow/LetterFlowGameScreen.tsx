// src/screens/letter-flow/LetterFlowGameScreen.tsx
/**
 * @description The main UI component for the Letter Flow game.
 * It is now a pure presentational component wrapped by the `GameScreen` HOC,
 * which handles all loading and error states.
 */
import React from 'react';
import { useLetterFlowGame, usePassiveTouchFix } from '@powerletter/core';
import type { LetterFlowLevel } from '@powerletter/core';
import { LetterFlowBoard } from '@/molecules/LetterFlowBoard';
import { FoundWords } from '@/molecules/FoundWords';
import { GameControls } from '@/organisms/GameControls';
import { GameProgress } from '@/molecules/GameProgress';
import { FlowGameLayout } from '@/templates/FlowGameLayout';
import { GameScreen } from '@/organisms/GameScreen';
import { useAppRouter, useAppParams } from '../../contexts/RouterContext';

// 1. Define the pure UI component.
const LetterFlowGame: React.FC<ReturnType<typeof useLetterFlowGame>> = ({
  currentLevel,
  board,
  selectedPath,
  foundWords,
  notification,
  onClearNotification,
  gameState,
  activeLetter,
  handleBackWith,
  handleMouseDown,
  handleMouseEnter,
  handleMouseUp,
  onHint,
  onUndo,
  onReset,
  clearSelection,
  currentLevelIndex,
  nextLevel,
  t,
  instructions,
  gameModeState,
}) => {
  usePassiveTouchFix();

  const router = useAppRouter();
  const params = useAppParams<{ gameType?: string }>();
  const gameType = params.gameType ?? 'letter-flow';

  const handleBack = () => handleBackWith(router.push, gameType);

  const totalWords = Math.floor(((currentLevel as LetterFlowLevel)?.endpoints.length ?? 0) / 2);

  return (
    <FlowGameLayout
      title={t('letterFlowTitle', { ns: 'games' }) ?? currentLevel.id}
      levelIndex={currentLevelIndex ?? 0}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      instructions={instructions}
      notification={notification}
      onClearNotification={onClearNotification}
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
        foundWords.length > 0 ? <FoundWords foundWords={foundWords} t={{ selected: t('selected') }} /> : null
      }
      gameControlsContent={
        <GameControls
          onReset={onReset}
          onRemoveLetter={onUndo}
          onClearAnswer={clearSelection}
          onHint={onHint}
          onNextLevel={nextLevel}
          canRemove={foundWords.length > 0}
          canClear={selectedPath.length > 0}
          canCheck={false}
          canNext={gameState === 'won'}
          canHint={foundWords.length < totalWords}
          gameState={gameState}
          gameMode={gameModeState.gameMode}
          isKidsMode={false}
          labels={{
            remove: t('undo'), clear: t('clear'), check: t('check'), hint: t('hint'),
            showSolution: t('showSolution'), reset: t('reset'), prev: t('prev'), next: t('next'),
          }}
          showOnly={['remove', 'hint', 'reset', 'next']}
        />
      }
      progressContent={
        <GameProgress
          foundWords={foundWords}
          totalWords={totalWords}
          t={{ selected: t('selected'), of: t('of') }}
        />
      }
    >
      {null}
    </FlowGameLayout>
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
export const LetterFlowGameScreen: React.FC = () => (
  // @ts-ignore - useGameHook type mismatch due to @powerletter/core import in transition
  <GameScreen useGameHook={useLetterFlowGame} GameComponent={LetterFlowGame} />
);
