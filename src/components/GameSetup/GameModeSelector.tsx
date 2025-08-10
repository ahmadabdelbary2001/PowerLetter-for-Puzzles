import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, ArrowRight, ArrowLeft, Trophy, Target } from 'lucide-react';
import { useGameMode } from '../../hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useNavigate, useParams } from 'react-router-dom';

interface GameModeSelectorProps {
  onModeSelect: (modeId: 'single' | 'competitive') => void;
  onBack: () => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onModeSelect }) => {
  const { setGameMode } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const [selectedMode, setSelectedMode] = useState<'single' | 'competitive' | ''>('');
  
  const handleBack = () => {
    navigate('/games');
  };

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
      
      // If single player, start the game
      if (selectedMode === 'single') {
        navigate(`/game/${gameType}`);
      } 
      // If competitive mode, go to team configuration
      else if (selectedMode === 'competitive') {
        navigate(`/team-config/${gameType}`);
      }
      
      onModeSelect(selectedMode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="selection" />
      <main className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir={dir}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`flex items-center justify-center mb-4`}>
            <Trophy className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className={`text-3xl font-bold dark:text-white ${dir === 'rtl' ? 'mr-3' : 'ml-3'}`}>
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
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
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
      </main>
      <Footer />
    </div>
  );
};

export default GameModeSelector;
