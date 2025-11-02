import React from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import type { letterFlowLevel } from '../engine';
import { LetterFlowBoard } from '@/components/molecules/LetterFlowBoard';
import { FoundWords } from '@/components/molecules/FoundWords';
import GameControls from '@/components/organisms/GameControls';
import { GameProgress } from '@/components/molecules/GameProgress';
import { Notification } from '@/components/atoms/Notification';
import { useTranslation } from "@/hooks/useTranslation";
import { GameLayout } from '@/components/templates/GameLayout';
import { usePassiveTouchFix } from '../hooks/usePassiveTouchFix';
import { useInstructions } from '@/hooks/useInstructions';

const LetterFlowGameScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language
  // ✅ Fix: provide the correct instruction key and normalize null to undefined
  const rawInstructions = useInstructions('letterFlow');

  // ✅ Normalize to satisfy GameLayoutProps type
  const instructions = rawInstructions
    ? {
        title: rawInstructions.title ?? '',
        description: rawInstructions.description ?? '',
        steps: rawInstructions.steps ?? [],
      }
    : undefined;

  usePassiveTouchFix();

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
      // ✅ Fix type mismatch
      instructions={instructions}
    >
      {renderNotification()}

      <div className={`mb-6 touch-none ${dir === 'rtl' ? 'arabic-layout' : ''} transition-colors duration-300`} dir={dir}>
        {renderBoard()}
      </div>

      {renderFoundWords()}

      <GameControls
        onReset={onReset}
        onRemoveLetter={onUndo}
        onClearAnswer={clearSelection}
        onHint={onHint}
        onNextLevel={undefined}
        onPrevLevel={undefined}
        onCheckAnswer={() => {}}
        onShowSolution={undefined}
        canRemove={foundWords.length > 0}
        canClear={selectedPath.length > 0}
        canCheck={false}
        canPrev={Boolean(currentLevelIndex && currentLevelIndex > 0)}
        canNext={gameState === 'won'}
        canHint={foundWords.length < totalWords}
        hintsRemaining={undefined}
        gameState={gameState === 'won' ? 'won' : 'playing'}
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

      <GameProgress
        foundWords={foundWords}
        totalWords={totalWords}
        t={{ selected: t.selected, of: t.of }}
      />
    </GameLayout>
  );
};

export default LetterFlowGameScreen;
