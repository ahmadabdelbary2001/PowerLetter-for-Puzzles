// components/GameControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Delete, CheckCircle, Lightbulb, Eye } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';

interface Props {
  onRemoveLetter: () => void;
  onClearAnswer: () => void;
  onCheckAnswer: () => void;
  onShowSolution: () => void;
  canRemove: boolean;
  canClear: boolean;
  canCheck: boolean;
}

const GameControls: React.FC<Props> = ({
  onRemoveLetter,
  onClearAnswer,
  onCheckAnswer,
  onShowSolution,
  canRemove,
  canClear,
  canCheck,
}) => {
  const { isRTL } = useGameMode();

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-4">
      <Button onClick={onRemoveLetter} disabled={!canRemove} variant="outline">
        <Delete className="w-4 h-4 mr-2" />
        {isRTL ? 'حذف' : 'Remove'}
      </Button>

      <Button onClick={onClearAnswer} disabled={!canClear} variant="outline">
        <RotateCcw className="w-4 h-4 mr-2" />
        {isRTL ? 'مسح' : 'Clear'}
      </Button>

      <Button onClick={onCheckAnswer} disabled={!canCheck} className="bg-blue-600 hover:bg-blue-700">
        <CheckCircle className="w-4 h-4 mr-2" />
        {isRTL ? 'تحقق من الإجابة' : 'Check Answer'}
      </Button>

      <Button variant="outline">
        <Lightbulb className="w-4 h-4 mr-2" />
        {isRTL ? `تلميح` : `Hint`}
      </Button>

      <Button onClick={onShowSolution} variant="outline" className="text-red-600">
        <Eye className="w-4 h-4 mr-2" />
        {isRTL ? 'الحل' : 'Solution'}
      </Button>
    </div>
  );
};

export default GameControls;
