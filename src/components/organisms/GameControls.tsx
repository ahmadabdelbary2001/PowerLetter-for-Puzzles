// src/components/organisms/GameControls.tsx
import React from 'react';
import { GameButton } from '@/components/atoms/GameButton';
import { Lightbulb, RotateCcw, RefreshCw, Delete, CheckCircle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useGameMode } from '@/hooks/useGameMode';

/**
 * Props interface for the GameControls component
 * Defines all callbacks and state needed for game control buttons
 */
interface Props {
  /** Callback to reset the current game */
  onReset?: () => void;
  /** Callback to remove the last entered letter */
  onRemoveLetter: () => void;
  /** Callback to clear the entire answer */
  onClearAnswer: () => void;
  /** Callback to request a hint */
  onHint?: () => void;
  /** Callback to check if the current answer is correct */
  onCheckAnswer: () => void;
  /** Callback to show the solution */
  onShowSolution?: () => void;
  /** Callback to navigate to the previous level */
  onPrevLevel?: () => void;
  /** Callback to navigate to the next level */
  onNextLevel?: () => void;
  /** Flag indicating if remove letter action is available */
  canRemove?: boolean;
  /** Flag indicating if clear answer action is available */
  canClear?: boolean;
  /** Flag indicating if check answer action is available */
  canCheck?: boolean;
  /** Flag indicating if previous level navigation is available */
  canPrev?: boolean;
  /** Flag indicating if next level navigation is available */
  canNext?: boolean;
  /** Flag indicating if hint action is available */
  canHint?: boolean;
  /** Number of hints remaining for the current team */
  hintsRemaining?: number;
  /** Current state of the game */
  gameState: 'playing' | 'won' | 'failed';
  /** Localized labels for all buttons */
  labels: {
    remove: string;
    clear: string;
    hint: string;
    check: string;
    showSolution: string;
    reset: string;
    prev: string;
    next: string;
  };
  isKidsMode?: boolean;
}

/**
 * GameControls component - Renders game control buttons based on game state
 *
 * This component conditionally renders different sets of buttons based on:
 * - Current game state (playing, won, failed)
 * - Game mode (single player vs competitive)
 * - Available actions (canRemove, canCheck, etc.)
 *
 * In competitive mode, it hides Reset and Previous buttons to maintain game flow
 */
export const GameControls: React.FC<Props> = ({
  onReset,
  onRemoveLetter,
  onClearAnswer,
  onHint,
  onCheckAnswer,
  onShowSolution,
  onPrevLevel,
  onNextLevel,
  canRemove,
  canClear,
  canCheck,
  canPrev,
  canNext,
  canHint,
  hintsRemaining,
  gameState,
  labels,
  isKidsMode = false,
}) => {
  // Get text direction based on current language
  const { dir } = useTranslation();

  // Get current game mode to determine which buttons to show
  const { gameMode } = useGameMode();

  // Determine if we should show reset and previous buttons
  // In competitive mode, we hide these buttons
  const showResetAndPrev = gameMode !== 'competitive';

  if (isKidsMode) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4">
        <GameButton
          onClick={onRemoveLetter}
          disabled={!canRemove}
          icon={Delete}
          className="text-lg py-6 flex-1"
        >
          {labels.remove}
        </GameButton>
        <GameButton
          onClick={onClearAnswer}
          disabled={!canClear}
          icon={RotateCcw}
          className="text-lg py-6 flex-1"
        >
          {labels.clear}
        </GameButton>
        <GameButton
          onClick={onCheckAnswer}
          disabled={!canCheck}
          icon={CheckCircle}
          isPrimary={true}
          className="text-lg py-6 flex-1"
        >
          {labels.check}
        </GameButton>
      </div>
    );
  }

  // Render different controls when game is won
  if (gameState === 'won') {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {/* Only show reset button in single player mode
         * In competitive mode, we don't allow resetting to maintain game flow
         */}
        {showResetAndPrev && (
          <GameButton onClick={onReset} icon={RefreshCw}>
            {labels.reset}
          </GameButton>
        )}
        {/* Only show previous button in single player mode
         * In competitive mode, players must progress forward only
         */}
        {showResetAndPrev && canPrev && (
          <GameButton
            onClick={onPrevLevel}
            icon={dir === 'rtl' ? ArrowRight : ArrowLeft}
          >
            {labels.prev}
          </GameButton>
        )}
        {/* Only show next button in single player mode
         * In competitive mode, we automatically move to the next level
         */}
        {showResetAndPrev && canNext && (
          <GameButton
            onClick={onNextLevel}
            icon={dir === 'rtl' ? ArrowLeft : ArrowRight}
            isPrimary={true}
          >
            {labels.next}
          </GameButton>
        )}
      </div>
    );
  }

  // Render controls for active gameplay
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mt-4">
      {/* Remove last letter button */}
      <GameButton
        onClick={onRemoveLetter}
        disabled={!canRemove}
        icon={Delete}
        className="text-xs sm:text-sm"
      >
        {labels.remove}
      </GameButton>

      {/* Clear entire answer button */}
      <GameButton
        onClick={onClearAnswer}
        disabled={!canClear}
        icon={RotateCcw}
        className="text-xs sm:text-sm"
      >
        {labels.clear}
      </GameButton>

      {/* Hint button - shows remaining hints if available */}
      <GameButton
        onClick={onHint}
        disabled={!canHint}
        icon={Lightbulb}
        className="text-xs sm:text-sm"
      >
        {labels.hint}
        {hintsRemaining !== undefined && <span className="text-xs sm:text-sm"> ({hintsRemaining})</span>}
      </GameButton>

      {/* Check answer button - primary action */}
      <GameButton
        onClick={onCheckAnswer}
        disabled={!canCheck}
        icon={CheckCircle}
        isPrimary={true}
        className="text-xs sm:text-sm"
      >
        {labels.check}
      </GameButton>

      {/* Show solution button - hidden in competitive mode */}
      {showResetAndPrev && (
        <GameButton
          onClick={onShowSolution}
          icon={Eye}
          className="text-xs sm:text-sm"
        >
          {labels.showSolution}
        </GameButton>
      )}
    </div>
  );
};

export default GameControls;