import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Puzzle, BookOpen, Search, Lock } from 'lucide-react';
import { useGameMode } from '../../contexts/GameModeContext';
import type { GameType as GameModeType } from '@/contexts/GameModeContext';
import { useTranslation } from '@/hooks/useTranslation';

interface GameType {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  status: 'available' | 'coming_soon' | string;
  features: readonly string[];
}

interface GameTypeSelectorProps {
  onGameTypeSelect: (typeId: GameModeType) => void;
  onBack: () => void;
}

const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({ onGameTypeSelect, onBack }) => {
  const { gameType, setGameType } = useGameMode();
  const { t, dir } = useTranslation();

  const gameTypes: GameType[] = [
    {
      id: 'clue',
      title: t.clueTitle,
      description: t.clueDesc,
      icon: <Search className="w-8 h-8" />,
      status: 'available',
      features: t.clueFeatures,
    },
    {
      id: 'formation',
      title: t.formationTitle,
      description: t.formationDesc,
      icon: <Puzzle className="w-8 h-8" />,
      status: 'coming_soon',
      features: t.formationFeatures,
    },
    {
      id: 'category',
      title: t.categoryTitle,
      description: t.categoryDesc,
      icon: <BookOpen className="w-8 h-8" />,
      status: 'coming_soon',
      features: t.categoryFeatures,
    },
  ];

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            {t.available}
          </Badge>
        );
      case 'coming_soon':
        return (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            {t.comingSoon}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {t.unknown}
          </Badge>
        );
    }
  };

  const handleGameTypeSelect = (typeId: GameModeType): void => {
    setGameType(typeId);
    onGameTypeSelect(typeId);
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      dir={dir}
    >
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {t.selectGame}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t.selectGameDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {gameTypes.map((type) => (
            <Card
              key={type.id}
              className={`
                relative transition-all duration-300 hover:shadow-lg
                ${type.status === 'available'
                  ? 'hover:scale-105 cursor-pointer border-blue-200'
                  : 'opacity-75'
                }
                ${gameType === type.id && type.status === 'available'
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : ''
                }
              `}
              onClick={() => type.status === 'available' && handleGameTypeSelect(type.id as GameModeType)}
            >
              <CardHeader className={`text-center pb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex justify-center mb-4 text-blue-600 dark:text-blue-400`}>
                  {type.icon}
                </div>
                <div className={`flex justify-between items-start mb-2`}>
                  <CardTitle className={`text-lg font-semibold flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {type.title}
                  </CardTitle>
                  {getStatusBadge(type.status)}
                </div>
                <CardDescription className={`text-sm text-gray-600 dark:text-gray-400 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {type.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className={`font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t.features}:
                    </h4>
                    <ul className={`text-xs text-gray-600 dark:text-gray-400 space-y-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {type.features.map((feature, index) => (
                        <li key={index} className={`flex items-center`}>
                          <span className={`w-1.5 h-1.5 bg-blue-400 rounded-full ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => onGameTypeSelect(gameType as GameModeType)}
                    disabled={type.status !== 'available'}
                    variant={type.status === 'available' ? 'default' : 'secondary'}
                  >
                    {type.status === 'available' ? (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {t.playNow}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {t.comingSoon}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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

          {gameType && (
            <Button
              onClick={() => onGameTypeSelect(gameType)}
              className="flex items-center gap-2"
              disabled={gameTypes.find((t) => t.id === gameType)?.status !== 'available'}
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

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          <p>
            {t.moreGames}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameTypeSelector;