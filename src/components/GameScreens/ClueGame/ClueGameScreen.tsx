import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SolutionBoxes } from './SolutionBoxes';
import { LetterGrid } from './LetterGrid';
import GameControls from './GameControls';
import { ArrowLeft } from 'lucide-react';
import { useGameMode } from '@/contexts/GameModeContext';

interface ClueGameScreenProps {
  onBack: () => void;
}

const ClueGameScreen: React.FC<ClueGameScreenProps> = ({ onBack }) => {
  const { isRTL, language } = useGameMode();
  const solution = language === 'ar' ? 'تفاح' : 'APPLE';
  const clue = language === 'ar' ? 'نوع من الفاكهة' : 'A type of fruit';
  const letters = Array.from(new Set(solution.split(''))).sort();

  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleAddLetter = (letter: string) => {
    if (currentAnswer.length < solution.length) {
      setCurrentAnswer(prev => prev + letter);
    }
  };

  const handleRemoveLetter = () => setCurrentAnswer(prev => prev.slice(0, -1));
  const handleClearAnswer = () => setCurrentAnswer('');
  const handleCheckAnswer = () => {
    const isCorrect = currentAnswer === solution;
    alert(isCorrect
      ? isRTL ? 'إجابة صحيحة!' : 'Correct!'
      : isRTL ? 'إجابة خاطئة!' : 'Wrong answer!'
    );
  };
  const handleShowSolution = () => setCurrentAnswer(solution);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-xl mx-auto">
        {/* Header with Back and Theme Toggle */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? 'رجوع' : 'Back'}
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-white dark:bg-gray-800">
            <div className="flex flex-col space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">
                {isRTL ? 'البحث عن الكلمة بالدليل' : 'Clue-Driven Word Find'}
              </CardTitle>
              <Badge variant="secondary" className="self-center">
                {isRTL ? 'الدليل' : 'Clue'}
              </Badge>
              <p className="text-lg">{clue}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Solution Boxes */}
            <SolutionBoxes solution={solution} currentWord={currentAnswer} />

            {/* Letter Grid */}
            <LetterGrid
              letters={letters}
              selectedIndices={currentAnswer.split('').map(ch => letters.indexOf(ch))}
              onLetterClick={(index: number) => handleAddLetter(letters[index])}
              disabled={currentAnswer.length === solution.length}
            />

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClueGameScreen;
