import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, RotateCcw, RefreshCw, Delete, CheckCircle, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';

interface Props {
  onReset: () => void
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
  gameState
}) => {
  const { language, isRTL } = useGameMode();

  const texts = {
    english: {
      hint: "Hint",
      reset: "Reset",
      check: "Check Answer",
      showSolution: "Show Solution",
      prev: "Previous",
      next: "Next"
    },
    arabic: {
      hint: "تلميح",
      reset: "إعادة",
      check: "تحقق من الإجابة",
      showSolution: "أظهر الحل",
      prev: "السابق",
      next: "التالي"
    }
  } as const;

  const t = language === 'ar' ? texts.arabic : texts.english;

  if (gameState === 'won') {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t.reset}
        </Button>
        {canPrev && (
          <Button variant="outline" onClick={onPrevLevel} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t.prev}
          </Button>
        )}
        {canNext && (
          <Button onClick={onNextLevel} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            {t.next}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <Button onClick={onRemoveLetter} disabled={!canRemove} variant="outline">
        <Delete className="w-4 h-4 mr-2" />
        {isRTL ? 'حذف' : 'Remove'}
      </Button>

      <Button onClick={onClearAnswer} disabled={!canClear} variant="outline">
        <RotateCcw className="w-4 h-4mr-2" />
        {isRTL ? 'مسح' : 'Clear'}
      </Button>

      <Button variant="outline" onClick={onHint}>
        <Lightbulb className="h-4 w-4 mr-2" />
        {t.hint}
      </Button>

      <Button onClick={onCheckAnswer} disabled={!canCheck} className="bg-blue-600 hover:bg-blue-700 text-white">
        <CheckCircle className="w-4 h-4 mr-2" />
        {t.check}
      </Button>

      <Button variant="outline" onClick={onShowSolution} className="flex items-center gap-2">
        <Eye className="w-4 h-4 mr-2" />
        {t.showSolution}
      </Button>
    </div>
  );
};

export default GameControls;
