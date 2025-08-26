// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * @description Screen component for the Letter Flow game.
 */
import React, { useEffect } from 'react';
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
import type { letterFlowLevel } from '../engine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";
import { LetterFlowBoard } from "@/components/molecules/LetterFlowBoard";
import { FoundWords } from "@/components/molecules/FoundWords";
import { LetterFlowGameControls } from "@/components/molecules/LetterFlowGameControls";
import { GameProgress } from "@/components/molecules/GameProgress";
import { Notification } from "@/components/atoms/Notification";

const LetterFlowGameScreen: React.FC = () => {
  const { t, dir } = useTranslation();

  useEffect(() => {
    // Fix for passive event listener issue
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      if ((type === "touchmove" || type === "touchstart" || type === "touchend") && typeof options === "object" && !options.passive) {
        options = { ...options, passive: false };
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    return () => {
      // Restore original event listener
      EventTarget.prototype.addEventListener = originalAddEventListener;
    };
  }, []);
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
  } = useLetterFlowGame();

  // Render the game board
  const renderBoard = () => {
    return (
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
  };

  // Render found words
  const renderFoundWords = () => {
    if (foundWords.length === 0) return null;

    return (
      <FoundWords
        foundWords={foundWords}
        t={{ selected: t.selected }}
      />
    );
  };

  // Render notification
  const renderNotification = () => {
    if (!notification) return null;

    // Determine notification type based on content
    let type: 'success' | 'error' | 'warning' | 'info' = 'info';
    if (notification.includes('congrats')) {
      type = 'success';
    } else if (notification.includes('Already found') || notification.includes('cannot cross')) {
      type = 'warning';
    } else if (notification.includes('must connect') || notification.includes('horizontal or vertical')) {
      type = 'error';
    }

    return (
      <Notification
        message={notification}
        type={type}
      />
    );
  };

  // Render the game screen
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
        <Button onClick={handleBack} className="mt-4">
          {t.back}
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4`} dir={dir}>
      {renderNotification()}

      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className={`flex items-center justify-between mb-6`}>
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
          </Button>
          <h1 className="text-2xl font-bold">{t.letterFlowTitle}</h1>
          <div className="w-16"></div> {/* Spacer for alignment */}
        </div>

        {/* Game Board */}
        <div className="mb-6 touch-none">
          {renderBoard()}
        </div>

        {/* Found Words */}
        {renderFoundWords()}

        {/* Game Controls */}
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
          totalWords={Math.floor((currentLevel as letterFlowLevel).endpoints.length / 2)}
          t={{ selected: t.selected, of: t.of }}
        />
      </div>
    </div>
  );
};

export default LetterFlowGameScreen;