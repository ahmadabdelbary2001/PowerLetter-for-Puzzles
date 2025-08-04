// components/GameScreens/ClueGameScreen.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';
import GameControls from './GameControls';

interface ClueGameScreenProps {
  onBack: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = ({ onBack }) => {
  const { isRTL, language } = useGameMode();
  const clue = language === 'ar' ? 'نوع من الفاكهة' : 'A type of fruit';
  const solution = language === 'ar' ? 'تفاح' : 'APPLE';

  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleAddLetter = (letter: string) => {
    if (currentAnswer.length < solution.length) {
      setCurrentAnswer(prev => prev + letter);
    }
  };

  const handleRemoveLetter = () => {
    setCurrentAnswer(prev => prev.slice(0, -1));
  };

  const handleClearAnswer = () => {
    setCurrentAnswer('');
  };

  const handleCheckAnswer = () => {
    alert(
      currentAnswer === solution
        ? (isRTL ? 'إجابة صحيحة!' : 'Correct!')
        : (isRTL ? 'إجابة خاطئة!' : 'Wrong answer!')
    );
  };

  const handleShowSolution = () => {
    setCurrentAnswer(solution);
  };

  const letters = Array.from(new Set(solution.split(''))).sort();

  return (
    <div className="p-4 max-w-xl mx-auto">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {isRTL ? 'رجوع' : 'Back'}
      </Button>

      {/* Clue */}
      <h2 className="text-2xl font-semibold mb-2">
        {isRTL ? 'الدليل' : 'Clue'}: {clue}
      </h2>
      
      {/* Answer Boxes */}
      <div className="flex justify-center gap-2 text-2xl font-mono mb-4">
        {Array.from({ length: solution.length }).map((_, i) => (
          <div key={i} className="border-b-2 w-8 text-center">
            {currentAnswer[i] || ''}
          </div>
        ))}
      </div>

      {/* Letter Buttons */}
      <div className="flex justify-center gap-2 flex-wrap mb-4">
        {letters.map((letter, idx) => (
          <button
            key={idx}
            onClick={() => handleAddLetter(letter)}
            className="px-3 py-2 border rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Controls */}
      <GameControls
        onRemoveLetter={handleRemoveLetter}
        onClearAnswer={handleClearAnswer}
        onCheckAnswer={handleCheckAnswer}
        onShowSolution={handleShowSolution}
        canRemove={currentAnswer.length > 0}
        canClear={currentAnswer.length > 0}
        canCheck={currentAnswer.length === solution.length}
      />
    </div>
  );
};

export default ClueGameScreen;
