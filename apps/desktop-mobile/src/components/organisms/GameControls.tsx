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
import type { GameMode } from '@/types/game';

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
  showOnly?: ButtonKey[];
  icons?: Partial<Record<ButtonKey, LucideIcon>>;
  // --- Make `dir` prop optional to prevent breaking changes. ---
  dir?: 'ltr' | 'rtl';
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
  // --- Accept `dir` from props and provide a default value. ---
  dir = 'ltr',
}) => {

  // Helper functions
  const shouldShow = (key: ButtonKey) => {
    if (!showOnly) return true;
    return showOnly.includes(key);
  };
  const pickIcon = (key: ButtonKey, defaultIcon: LucideIcon) => icons?.[key] ?? defaultIcon;

  // Kids mode has its own simple layout
  if (isKidsMode) {
    return (
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4">
        {shouldShow('remove') && <GameButton onClick={onRemoveLetter} disabled={!canRemove} icon={pickIcon('remove', Delete)} className="text-lg py-6 flex-1">{labels.remove}</GameButton>}
        {shouldShow('clear') && <GameButton onClick={onClearAnswer} disabled={!canClear} icon={pickIcon('clear', RotateCcw)} className="text-lg py-6 flex-1">{labels.clear}</GameButton>}
        {shouldShow('check') && <GameButton onClick={onCheckAnswer} disabled={!canCheck} icon={pickIcon('check', CheckCircle)} isPrimary={true} className="text-lg py-6 flex-1">{labels.check}</GameButton>}
      </div>
    );
  }

  // This block now ONLY handles the 'won' state in single-player mode
  if (gameState === 'won' && gameMode !== 'competitive') {
    return (
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {shouldShow('reset') && (
          <GameButton onClick={onReset} icon={pickIcon('reset', RefreshCw)}>
            {labels.reset}
          </GameButton>
        )}
        {canPrev && shouldShow('prev') && (
          <GameButton onClick={onPrevLevel} icon={pickIcon('prev', dir === 'rtl' ? ArrowRight : ArrowLeft)}>
            {labels.prev}
          </GameButton>
        )}
        {canNext && shouldShow('next') && (
          <GameButton onClick={onNextLevel} icon={pickIcon('next', dir === 'rtl' ? ArrowLeft : ArrowRight)} isPrimary={true}>
            {labels.next}
          </GameButton>
        )}
      </div>
    );
  }

  // This is now the default block for BOTH 'playing' AND 'failed' states
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
      {gameMode !== 'competitive' && shouldShow('showSolution') && (
        <GameButton onClick={onShowSolution} icon={pickIcon('showSolution', Eye)} className="text-xs sm:text-sm">
          {labels.showSolution}
        </GameButton>
      )}
    </div>
  );
};

export default GameControls;
