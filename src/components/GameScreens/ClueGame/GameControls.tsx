import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, RefreshCw, Delete, CheckCircle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useGameMode } from '@/hooks/useGameMode';

/**
 * Props interface for the GameControls component
 * Defines all callbacks and state needed for game control buttons
 */
interface Props {
  /** Callback to reset the current game */
  onReset: () => void;
  /** Callback to remove the last entered letter */
  onRemoveLetter: () => void;
  /** Callback to clear the entire answer */
  onClearAnswer: () => void;
  /** Callback to request a hint */
  onHint: () => void;
  /** Callback to check if the current answer is correct */
  onCheckAnswer: () => void;
  /** Callback to show the solution */
  onShowSolution: () => void;
  /** Callback to navigate to the previous level */
  onPrevLevel: () => void;
  /** Callback to navigate to the next level */
  onNextLevel: () => void;
  /** Flag indicating if remove letter action is available */
  canRemove: boolean;
  /** Flag indicating if clear answer action is available */
  canClear: boolean;
  /** Flag indicating if check answer action is available */
  canCheck: boolean;
  /** Flag indicating if previous level navigation is available */
  canPrev: boolean;
  /** Flag indicating if next level navigation is available */
  canNext: boolean;
  /** Flag indicating if hint action is available */
  canHint: boolean;
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
const GameControls: React.FC<Props> = ({
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
  labels
}) => {
  // Get text direction based on current language
  const { dir } = useTranslation();
  
  // Get current game mode to determine which buttons to show
  const { gameMode } = useGameMode();
  
  // Determine if we should show reset and previous buttons
  // In competitive mode, we hide these buttons
  const showResetAndPrev = gameMode !== 'competitive';

  // Render different controls when game is won
  if (gameState === 'won') {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {/* Only show reset button in single player mode
         * In competitive mode, we don't allow resetting to maintain game flow
         */}
        {showResetAndPrev && (
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {labels.reset}
          </Button>
        )}
        {/* Only show previous button in single player mode
         * In competitive mode, players must progress forward only
         */}
        {showResetAndPrev && canPrev && (
          <Button 
            variant="outline" 
            onClick={onPrevLevel} 
            className="flex items-center gap-2"
          >
            {/* Direction-aware arrow icon based on text direction */}
            {dir === 'rtl' ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            {labels.prev}
          </Button>
        )}
        {canNext && (
          <Button 
            onClick={onNextLevel} 
            className="flex items-center gap-2"
          >
            {dir === 'rtl' ? (
              <>
                {labels.next}
                <ArrowLeft className="h-4 w-4" />
              </>
            ) : (
              <>
                {labels.next}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    );
  }

  // Render controls for active gameplay
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mt-4">
      {/* Remove last letter button */}
      <Button onClick={onRemoveLetter} disabled={!canRemove} variant="outline" className="text-xs sm:text-sm">
        <Delete className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">{labels.remove}</span>
      </Button>

      {/* Clear entire answer button */}
      <Button onClick={onClearAnswer} disabled={!canClear} variant="outline" className="text-xs sm:text-sm">
        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">{labels.clear}</span>
      </Button>

      {/* Hint button - shows remaining hints if available */}
      <Button variant="outline" onClick={onHint} disabled={!canHint} className="text-xs sm:text-sm">
        <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">{labels.hint}</span>
        {hintsRemaining !== undefined && <span className="text-xs sm:text-sm"> ({hintsRemaining})</span>}
      </Button>

      {/* Check answer button - primary action */}
      <Button onClick={onCheckAnswer} disabled={!canCheck} className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">{labels.check}</span>
      </Button>

      {/* Show solution button */}
      <Button variant="outline" onClick={onShowSolution} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        <span className="text-xs sm:text-sm">{labels.showSolution}</span>
      </Button>
    </div>
  );
};

export default GameControls;