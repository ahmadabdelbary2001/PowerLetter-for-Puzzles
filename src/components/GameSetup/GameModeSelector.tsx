import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, ArrowRight, ArrowLeft, Trophy, Target } from 'lucide-react';
import { useGameMode } from '../../contexts/GameModeContext';

interface GameModeSelectorProps {
  onModeSelect: (modeId: 'single' | 'competitive') => void;
  onBack: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onModeSelect, onBack }) => {
  const { setGameMode, isRTL } = useGameMode();
  const [selectedMode, setSelectedMode] = useState<'single' | 'competitive' | ''>('');

  const gameModes = [
    {
      id: 'single',
      title: isRTL ? 'لاعب واحد' : 'Single Player',
      description: isRTL ? 'العب بمفردك وتحدى نفسك' : 'Play solo and challenge yourself',
      icon: <User className="w-8 h-8" />,
      features: [
        isRTL ? 'تقدم شخصي' : 'Personal progress',
        isRTL ? 'تحديات متدرجة' : 'Progressive challenges',
        isRTL ? 'نظام تلميحات' : 'Hint system',
      ],
      color: 'blue',
    },
    {
      id: 'competitive',
      title: isRTL ? 'تنافسي' : 'Competitive',
      description: isRTL ? 'العب مع الأصدقاء في فرق' : 'Play with friends in teams',
      icon: <Users className="w-8 h-8" />,
      features: [
        isRTL ? 'فرق متعددة' : 'Multiple teams',
        isRTL ? 'نظام نقاط' : 'Scoring system',
        isRTL ? 'دوران الأدوار' : 'Turn-based play',
      ],
      color: 'blue',
    },
  ] as const;

  const handleModeSelect = (modeId: 'single' | 'competitive') => {
    setSelectedMode(modeId);
  };

  const handleContinue = () => {
    if (selectedMode) {
      setGameMode(selectedMode);
      onModeSelect(selectedMode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isRTL ? 'اختر نمط اللعب' : 'Choose Game Mode'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isRTL ? 'كيف تريد أن تلعب اليوم؟' : 'How would you like to play today?'}
          </p>
        </div>

        {/* Game Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {gameModes.map((mode) => (
            <Card
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`
                cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                ${selectedMode === mode.id
                  ? `ring-2 ring-${mode.color}-500 bg-${mode.color}-50 dark:bg-${mode.color}-900/20`
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
              `}
            >
              <CardHeader className={`text-center ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex ${isRTL ? 'justify-end' : 'justify-center'} mb-4 text-${mode.color}-600 dark:text-${mode.color}-400`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-2xl">{mode.title}</CardTitle>
                <CardDescription className="text-lg">{mode.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  <h4 className={`font-medium text-sm text-gray-700 dark:text-gray-300 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? 'المميزات:' : 'Features:'}
                  </h4>
                  <ul className={`text-sm text-gray-600 dark:text-gray-400 space-y-1 ${isRTL ? 'text-right' : ''}`}>
                    {mode.features.map((feature, index) => (
                      <li key={index} className={`flex items-center ${isRTL ? 'justify-end' : ''}`}>
                        <span className={`w-1.5 h-1.5 bg-${mode.color}-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  variant={selectedMode === mode.id ? 'default' : 'outline'}
                >
                  {selectedMode === mode.id ? (
                    <>
                      <span>{isRTL ? 'مختار' : 'Selected'}</span>
                      <Target className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <span>{isRTL ? 'اختر' : 'Select'}</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? 'رجوع' : 'Back'}
          </Button>

          {selectedMode && (
            <Button
              onClick={handleContinue}
              className="flex items-center gap-2"
            >
              {isRTL ? 'متابعة' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;
