// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * @description The main UI component for the Letter Flow game.
 * It is now a pure presentational component wrapped by the `GameScreen` HOC,
 * which handles all loading and error states.
 */
import React from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import { LetterFlowBoard } from '@/components/molecules/LetterFlowBoard';
import { FoundWords } from '@/components/molecules/FoundWords';
import GameControls from '@/components/organisms/GameControls';
import { GameProgress } from '@/components/molecules/GameProgress';
import { usePassiveTouchFix } from '../hooks/usePassiveTouchFix';
import { FlowGameLayout } from '@/components/templates/FlowGameLayout';
import type { LetterFlowLevel } from '../engine';
import { GameScreen } from '@/components/organisms/GameScreen'; // Import the HOC

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
  handleBack,
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
      children={null}
    />
  );
};

// 2. Create the final export by wrapping the pure UI component with the GameScreen HOC.
const LetterFlowGameScreen: React.FC = () => (
  <GameScreen useGameHook={useLetterFlowGame} GameComponent={LetterFlowGame} />
);

export default LetterFlowGameScreen;
