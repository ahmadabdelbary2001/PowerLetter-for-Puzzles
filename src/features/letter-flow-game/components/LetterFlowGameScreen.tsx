// src/features/letter-flow-game/components/LetterFlowGameScreen.tsx
/**
 * This file contains the main screen component for the Letter Flow game.
 * It renders the game board, controls, and found words display.
 * It handles user interactions and manages the game state through the useLetterFlowGame hook.
 */

import React from 'react';
// Game logic hook
import { useLetterFlowGame } from '../hooks/useLetterFlowGame';
// Game level type definition
import type { letterFlowLevel } from '../engine';
// UI components
import { Button } from '@/components/ui/button';
// Icons for navigation
import { ArrowLeft, ArrowRight } from 'lucide-react';
// Translation hook for internationalization
import { useTranslation } from "@/hooks/useTranslation";
// Game board component
import { LetterFlowBoard } from "@/components/molecules/LetterFlowBoard";
// Component to display found words
import { FoundWords } from "@/components/molecules/FoundWords";
// Game control buttons
import { LetterFlowGameControls } from "@/components/molecules/LetterFlowGameControls";
// Progress tracker
import { GameProgress } from "@/components/molecules/GameProgress";
// Notification system
import { Notification } from "@/components/atoms/Notification";
// Hook to fix passive touch issues
import { usePassiveTouchFix } from '../hooks/usePassiveTouchFix';

/**
 * Main game screen component for the Letter Flow game
 * 
 * This component serves as the primary UI for the game, displaying the game board,
 * found words, and game controls. It manages user interactions and displays game status.
 */
const LetterFlowGameScreen: React.FC = () => {
  // Get translation function and text direction
  const { t, dir } = useTranslation();

  // Apply passive touch fix to improve mobile interaction
  usePassiveTouchFix();

  // Destructure game state and handlers from the useLetterFlowGame hook
  const {
    loading,              // Loading state
    currentLevel,         // Current game level
    board,                // Game board configuration
    selectedPath,         // Currently selected path on the board
    foundWords,           // Array of found words
    notification,         // Game notification message
    activeLetter,         // Currently active letter
    handleBack,           // Function to go back to previous screen
    handleMouseDown,      // Function to handle mouse down on board cells
    handleMouseEnter,     // Function to handle mouse enter on board cells
    handleMouseUp,        // Function to handle mouse up
    onHint,               // Function to request a hint
    onUndo,               // Function to undo the last action
    onReset,              // Function to reset the current level
  } = useLetterFlowGame();

  /**
   * Renders the game board with current state
   * @returns JSX element for the game board
   */
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

  /**
   * Renders the found words section if there are any words found
   * @returns JSX element for found words or null if no words found
   */
  const renderFoundWords = () => (
    foundWords.length === 0 ? null : (
      <FoundWords foundWords={foundWords} t={{ selected: t.selected }} />
    )
  );

  /**
   * Renders game notification with appropriate styling based on notification type
   * @returns JSX element for notification or null if no notification
   */
  const renderNotification = () => {
    if (!notification) return null;
    let type: 'success' | 'error' | 'warning' | 'info' = 'info';
    if (notification.includes('congrats') || notification === t.congrats) type = 'success';
    else if (notification.includes('Already found') || notification.includes('cannot cross')) type = 'warning';
    else if (notification.includes('must connect') || notification.includes('horizontal or vertical')) type = 'error';

    return <Notification message={notification} type={type} />;
  };

  // Display loading screen while game is loading
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="text-xl">{t.loading}...</div>
      </div>
    );
  }

  // Display error screen if no level is found
  if (!currentLevel) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="text-xl">{t.noLevelsFound}</div>
        <Button onClick={handleBack} className="mt-4">{t.back}</Button>
      </div>
    );
  }

  // Calculate total words in the level (each word has 2 endpoints)
  const totalWords = Math.floor(((currentLevel as letterFlowLevel)?.endpoints.length ?? 0) / 2);

  // Main game UI container
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4`} dir={dir}>
      {renderNotification()}

      <div className="w-full max-w-2xl">
        {/* Header with back button and title */}
        <div className={`flex items-center justify-between mb-6`}>
          <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
            {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
          </Button>
          <h1 className="text-2xl font-bold">{t.letterFlowTitle}</h1>
          <div className="w-16"></div>
        </div>

        {/* Game board container with touch-none to prevent scrolling issues */}
        <div className="mb-6 touch-none">
          {renderBoard()}
        </div>

        {/* Display found words section */}
        {renderFoundWords()}

        {/* Game control buttons (hint, undo, reset) */}
        <LetterFlowGameControls
          onHint={onHint}
          onUndo={onUndo}
          onReset={onReset}
          t={{ hint: t.hint, undo: t.undo, reset: t.reset }}
          dir={dir as 'ltr' | 'rtl'}
        />

        {/* Game progress indicator showing found words count */}
        <GameProgress
          foundWords={foundWords}
          totalWords={totalWords}
          t={{ selected: t.selected, of: t.of }}
        />
      </div>
    </div>
  );
};

/**
 * Export the component as default
 */
export default LetterFlowGameScreen;