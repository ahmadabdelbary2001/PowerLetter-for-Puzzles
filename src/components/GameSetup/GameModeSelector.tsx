import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, ArrowRight, ArrowLeft, Trophy, Target } from 'lucide-react';
import { useGameMode } from '../../hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';

interface GameModeSelectorProps {
  onModeSelect: (modeId: 'single' | 'competitive') => void;
  onBack: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onModeSelect, onBack }) => {
  const { setGameMode } = useGameMode();
  const { t, dir } = useTranslation();
  const [selectedMode, setSelectedMode] = useState<'single' | 'competitive' | ''>('');

  const gameModes = [
    {
      id: 'single',
      title: t.singlePlayer,
      description: t.singlePlayerDesc,
      icon: <User className="w-8 h-8" />,
      features: t.singleFeatures,
      color: 'blue',
    },
    {
      id: 'competitive',
      title: t.competitive,
      description: t.competitiveDesc,
      icon: <Users className="w-8 h-8" />,
      features: t.competitiveFeatures,
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
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      dir={dir}
    >
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`flex items-center justify-center mb-4`}>
            <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className={`text-3xl font-bold text-gray-800 dark:text-white ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
              {t.selectMode}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.selectModeDesc}
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
                  ? `ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20`
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
              `}
            >
              <CardHeader className={`text-center`}>
                <div className={`flex justify-center mb-4 text-blue-600 dark:text-blue-400`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-2xl">{mode.title}</CardTitle>
                <CardDescription className="text-lg">{mode.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3 mb-6">
                  <h4 className={`font-medium text-sm text-gray-700 dark:text-gray-300`}>
                    {t.features}:
                  </h4>
                  <ul className={`text-sm text-gray-600 dark:text-gray-400 space-y-1`}>
                    {mode.features.map((feature, index) => (
                      <li key={index} className={`flex items-center`}>
                        <span className={`w-1.5 h-1.5 bg-blue-400 rounded-full ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></span>
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
                      <span>{t.selected}</span>
                      <Target className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <span>{t.select}</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            {/* Reverse arrow direction for RTL */}
            {dir === 'rtl' ? (
              <>
                <ArrowRight className="w-4 h-4" />
                {t.back}
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </>
            )}
          </Button>
          {selectedMode && (
            <Button
              onClick={handleContinue}
              className="flex items-center gap-2"
            >
              {/* Reverse arrow direction for RTL */}
              {dir === 'rtl' ? (
                <>
                  {t.continue}
                  <ArrowLeft className="w-4 h-4" />
                </>
              ) : (
                <>
                  {t.continue}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModeSelector;