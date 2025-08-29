// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * LetterFlowGameScreen - Main screen for the Letter Flow game.
 * Uses the shared GameLayout so the header, back button and level badge
 * match other games (Clue, etc.).
 */
import React from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import type { letterFlowLevel } from '../engine';
import { LetterFlowBoard } from '@/components/molecules/LetterFlowBoard';
import { FoundWords } from '@/components/molecules/FoundWords';
import { LetterFlowGameControls } from '@/components/molecules/LetterFlowGameControls';
import { GameProgress } from '@/components/molecules/GameProgress';
import { Notification } from '@/components/atoms/Notification';
import { useTranslation } from '@/hooks/useTranslation';
import { GameLayout } from '@/components/templates/GameLayout';
import { usePassiveTouchFix } from '../hooks/usePassiveTouchFix';

const LetterFlowGameScreen: React.FC = () => {
  // get translation + direction (same pattern used in other games)
  const { t, dir } = useTranslation();

  // apply passive touch fix
  usePassiveTouchFix();

  const {
    loading,
    currentLevel,
    board,
    selectedPath,
    foundWords,
    notification,
    activeLetter,
    handleBack,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    onHint,
    onUndo,
    onReset,
    currentLevelIndex,
  } = useLetterFlowGame();

  const renderBoard = () => (
    <LetterFlowBoard
      cells={board}
      selectedPath={selectedPath}
      foundWords={foundWords}
      activeLetter={activeLetter}
      onMouseDown={(cell) => handleMouseDown({ ...cell, isUsed: false })}
      onMouseEnter={(cell) => handleMouseEnter({ ...cell, isUsed: false })}
      onMouseUp={handleMouseUp}
    />
  );

  const renderFoundWords = () =>
    foundWords.length === 0 ? null : <FoundWords foundWords={foundWords} t={{ selected: t.selected }} />;

  const renderNotification = () => {
    if (!notification) return null;
    let type: 'success' | 'error' | 'warning' | 'info' = 'info';
    if (notification.includes('congrats') || notification === t.congrats) type = 'success';
    else if (notification.includes('Already found') || notification.includes('cannot cross')) type = 'warning';
    else if (notification.includes('must connect') || notification.includes('horizontal or vertical')) type = 'error';

    return <Notification message={notification} type={type} />;
  };

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="text-xl">{t.loading}...</div>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="text-xl">{t.noLevelsFound}</div>
        <button onClick={handleBack} className="mt-4 btn">
          {t.back}
        </button>
      </div>
    );
  }

  const totalWords = Math.floor(((currentLevel as letterFlowLevel)?.endpoints.length ?? 0) / 2);

  return (
    <GameLayout
      title={t.letterFlowTitle ?? currentLevel.id}
      levelIndex={currentLevelIndex ?? 0}
      onBack={handleBack}
      difficulty={currentLevel.difficulty}
      layoutType="text"
    >
      {/* Notification */}
      {renderNotification()}

      {/* Board - use dir to apply RTL-specific styling if needed */}
      <div className={`mb-6 touch-none ${dir === 'rtl' ? 'arabic-layout' : ''} transition-colors duration-300`} dir={dir}>
        {renderBoard()}
      </div>

      {/* Found Words */}
      {renderFoundWords()}

      {/* Controls */}
      <LetterFlowGameControls
        onHint={onHint}
        onUndo={onUndo}
        onReset={onReset}
        t={{ hint: t.hint, undo: t.undo, reset: t.reset }}
        dir={dir as 'ltr' | 'rtl'}
      />

      {/* Progress */}
      <GameProgress
        foundWords={foundWords}
        totalWords={totalWords}
        t={{ selected: t.selected, of: t.of }}
      />
    </GameLayout>
  );
};

export default LetterFlowGameScreen;
