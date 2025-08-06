import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, RefreshCw, Delete, CheckCircle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  onReset: () => void;
  onRemoveLetter: () => void;
  onClearAnswer: () => void;
  onHint: () => void;
  onCheckAnswer: () => void;
  onShowSolution: () => void;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  canRemove: boolean;
  canClear: boolean;
  canCheck: boolean;
  canPrev: boolean;
  canNext: boolean;
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
}

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
  gameState,
  labels
}) => {
  const { dir } = useTranslation(); // Moved inside the component

  if (gameState === 'won') {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {labels.reset}
        </Button>
        {canPrev && (
          <Button 
            variant="outline" 
            onClick={onPrevLevel} 
            className="flex items-center gap-2"
          >
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

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <Button onClick={onRemoveLetter} disabled={!canRemove} variant="outline">
        <Delete className="w-4 h-4 mr-2" />
        {labels.remove}
      </Button>

      <Button onClick={onClearAnswer} disabled={!canClear} variant="outline">
        <RotateCcw className="w-4 h-4 mr-2" />
        {labels.clear}
      </Button>

      <Button variant="outline" onClick={onHint}>
        <Lightbulb className="h-4 w-4 mr-2" />
        {labels.hint}
      </Button>

      <Button onClick={onCheckAnswer} disabled={!canCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
        <CheckCircle className="w-4 h-4 mr-2" />
        {labels.check}
      </Button>

      <Button variant="outline" onClick={onShowSolution} className="flex items-center gap-2">
        <Eye className="w-4 h-4 mr-2" />
        {labels.showSolution}
      </Button>
    </div>
  );
};

export default GameControls;