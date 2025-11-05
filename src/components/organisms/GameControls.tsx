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
import { useTranslation } from "@/hooks/useTranslation";
import type { GameMode } from '@/types/game';

/**
 * Props interface for the GameControls component
 */
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
  gameMode: GameMode;
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
  showOnly?: Array<'remove' | 'clear' | 'hint' | 'check' | 'showSolution' | 'reset' | 'prev' | 'next'>;
  icons?: Partial<Record<'remove' | 'clear' | 'hint' | 'check' | 'showSolution' | 'reset' | 'prev' | 'next', LucideIcon>>;
}

/**
 * GameControls component - Renders game control buttons based on game state
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
  gameMode,
  labels,
  isKidsMode = false,
  showOnly,
  icons,
}) => {
  const { dir } = useTranslation();
  const showResetAndPrev = gameMode !== 'competitive';

  const shouldShow = (key: 'remove' | 'clear' | 'hint' | 'check' | 'showSolution' | 'reset' | 'prev' | 'next') => {
    if (!showOnly) return true;
    return showOnly.includes(key);
  };

  const pickIcon = (key: 'remove' | 'clear' | 'hint' | 'check' | 'showSolution' | 'reset' | 'prev' | 'next', defaultIcon: LucideIcon) => icons?.[key] ?? defaultIcon;

  // --- Prioritize isKidsMode rendering ---
  // If it's a kids' game, always show the simple controls, regardless of the 'failed' state.
  // This prevents the navigation buttons from incorrectly appearing.
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

  // Render navigation controls for 'won' or 'failed' states in adult games
  if (gameState === 'won' || gameState === 'failed') {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4">
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
        {canNext && shouldShow('next') && (
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

  // Default ('playing') controls for adult games
  return (
    <div className="flex flex-wrap gap-1 sm:gap-2 justify-center mt-4">
      {shouldShow('remove') && (
        <GameButton onClick={onRemoveLetter} disabled={!canRemove} icon={pickIcon('remove', Delete)} className="text-xs sm:text-sm">
          {labels.remove}
        </GameButton>
      )}
      {shouldShow('clear') && (
        <GameButton onClick={onClearAnswer} disabled={!canClear} icon={pickIcon('clear', RotateCcw)} className="text-xs sm:text-sm">
          {labels.clear}
        </GameButton>
      )}
      {shouldShow('hint') && (
        <GameButton onClick={onHint} disabled={!canHint} icon={pickIcon('hint', Lightbulb)} className="text-xs sm:text-sm">
          {labels.hint}
          {hintsRemaining !== undefined && <span className="text-xs sm:text-sm"> ({hintsRemaining})</span>}
        </GameButton>
      )}
      {shouldShow('check') && (
        <GameButton onClick={onCheckAnswer} disabled={!canCheck} icon={pickIcon('check', CheckCircle)} isPrimary={true} className="text-xs sm:text-sm">
          {labels.check}
        </GameButton>
      )}
      {showResetAndPrev && shouldShow('showSolution') && (
        <GameButton onClick={onShowSolution} icon={pickIcon('showSolution', Eye)} className="text-xs sm:text-sm">
          {labels.showSolution}
        </GameButton>
      )}
    </div>
  );
};

export default GameControls;
