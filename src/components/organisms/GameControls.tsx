// src/components/organisms/GameControls.tsx
import React from 'react';
import { GameButton } from '@/components/atoms/GameButton';
import {
  Lightbulb,
  RotateCcw,
  RefreshCw,
  Delete,
  CheckCircle,
  Eye,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useGameMode } from '@/hooks/useGameMode';

/**
 * Props interface for the GameControls component
 */
type ButtonKey = 'remove' | 'clear' | 'hint' | 'check' | 'showSolution' | 'reset' | 'prev' | 'next';

interface Props {
  onReset?: () => void;
  onRemoveLetter?: () => void;
  onClearAnswer?: () => void;
  onHint?: () => void;
  onCheckAnswer?: () => void;
  onShowSolution?: () => void;
  onPrevLevel?: () => void;
  onNextLevel?: () => void;
  canRemove?: boolean;
  canClear?: boolean;
  canCheck?: boolean;
  canPrev?: boolean;
  canNext?: boolean;
  canHint?: boolean;
  hintsRemaining?: number;
  gameState: 'playing' | 'won' | 'failed';
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
  /**
   * Optional: if provided, only the named buttons will be rendered.
   * Example: showOnly={['remove','hint','reset','next']}
   */
  showOnly?: ButtonKey[];
  /**
   * Optional icon overrides for specific button keys.
   * Example: icons={{ remove: Shuffle }}
   */
  icons?: Partial<Record<ButtonKey, LucideIcon>>;
}

/**
 * GameControls component - Renders game control buttons based on game state
 *
 * This component conditionally renders different sets of buttons based on:
 * - Current game state (playing, won, failed)
 * - Game mode (single player vs competitive)
 * - Allowed buttons passed via `showOnly` (to restrict which buttons are visible)
 * - Optional icon overrides via `icons`
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
  showOnly,
  icons,
}) => {
  const { dir } = useTranslation();
  const { gameMode } = useGameMode();

  // In competitive mode we hide reset/prev to encourage flow
  const showResetAndPrev = gameMode !== 'competitive';

  const shouldShow = (key: ButtonKey) => {
    if (!showOnly) return true;
    return showOnly.includes(key);
  };

  // Helper to pick icon (override if provided)
  const pickIcon = (key: ButtonKey, defaultIcon: LucideIcon) => icons?.[key] ?? defaultIcon;

  if (isKidsMode) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4">
        {shouldShow('remove') && (
          <GameButton
            onClick={onRemoveLetter}
            disabled={!canRemove}
            icon={pickIcon('remove', Delete)}
            className="text-lg py-6 flex-1"
          >
            {labels.remove}
          </GameButton>
        )}
        {shouldShow('clear') && (
          <GameButton
            onClick={onClearAnswer}
            disabled={!canClear}
            icon={pickIcon('clear', RotateCcw)}
            className="text-lg py-6 flex-1"
          >
            {labels.clear}
          </GameButton>
        )}
        {shouldShow('check') && (
          <GameButton
            onClick={onCheckAnswer}
            disabled={!canCheck}
            icon={pickIcon('check', CheckCircle)}
            isPrimary={true}
            className="text-lg py-6 flex-1"
          >
            {labels.check}
          </GameButton>
        )}
      </div>
    );
  }

  // Render when game is won
  if (gameState === 'won') {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {showResetAndPrev && shouldShow('reset') && (
          <GameButton onClick={onReset} icon={pickIcon('reset', RefreshCw)}>
            {labels.reset}
          </GameButton>
        )}
        {showResetAndPrev && canPrev && shouldShow('prev') && (
          <GameButton
            onClick={onPrevLevel}
            icon={pickIcon('prev', dir === 'rtl' ? ArrowRight : ArrowLeft)}
          >
            {labels.prev}
          </GameButton>
        )}
        {showResetAndPrev && canNext && shouldShow('next') && (
          <GameButton
            onClick={onNextLevel}
            icon={pickIcon('next', dir === 'rtl' ? ArrowLeft : ArrowRight)}
            isPrimary={true}
          >
            {labels.next}
          </GameButton>
        )}
      </div>
    );
  }

  // Default (playing / failed) controls
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mt-4">
      {shouldShow('remove') && (
        <GameButton
          onClick={onRemoveLetter}
          disabled={!canRemove}
          icon={pickIcon('remove', Delete)}
          className="text-xs sm:text-sm"
        >
          {labels.remove}
        </GameButton>
      )}

      {shouldShow('clear') && (
        <GameButton
          onClick={onClearAnswer}
          disabled={!canClear}
          icon={pickIcon('clear', RotateCcw)}
          className="text-xs sm:text-sm"
        >
          {labels.clear}
        </GameButton>
      )}

      {shouldShow('hint') && (
        <GameButton
          onClick={onHint}
          disabled={!canHint}
          icon={pickIcon('hint', Lightbulb)}
          className="text-xs sm:text-sm"
        >
          {labels.hint}
          {hintsRemaining !== undefined && <span className="text-xs sm:text-sm"> ({hintsRemaining})</span>}
        </GameButton>
      )}

      {shouldShow('check') && (
        <GameButton
          onClick={onCheckAnswer}
          disabled={!canCheck}
          icon={pickIcon('check', CheckCircle)}
          isPrimary={true}
          className="text-xs sm:text-sm"
        >
          {labels.check}
        </GameButton>
      )}

      {showResetAndPrev && shouldShow('showSolution') && (
        <GameButton
          onClick={onShowSolution}
          icon={pickIcon('showSolution', Eye)}
          className="text-xs sm:text-sm"
        >
          {labels.showSolution}
        </GameButton>
      )}
    </div>
  );
};

export default GameControls;
