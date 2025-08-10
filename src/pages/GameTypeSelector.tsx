import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Puzzle, BookOpen, Search, Lock } from 'lucide-react';
import { useGameMode } from '../hooks/useGameMode';
import type { GameType as GameModeType } from '@/types/game';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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

const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({ onGameTypeSelect }) => {
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
    // Navigate to game mode selection page
    window.location.href = `/PowerLetter-for-Puzzles/game-mode/${typeId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="selection" />
      <main className="min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-4 py-8 max-w-6xl" dir={dir}>
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold dark:text-white mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t.selectGame}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t.selectGameDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {gameTypes.map((type) => (
            <Card
              key={type.id}
              className={`
                relative transition-all duration-300 hover:shadow-lg card-hover
                ${type.status === 'available'
                  ? 'hover:scale-[1.02] cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/80'
                  : 'opacity-75'
                }
                ${gameType === type.id && type.status === 'available'
                  ? 'ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10'
                  : ''
                }
              `}
              onClick={() => type.status === 'available' && handleGameTypeSelect(type.id as GameModeType)}
            >
              <CardHeader className={`text-center pb-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className={`flex justify-center mb-4 text-primary dark:text-primary/80`}>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {type.icon}
                  </div>
                </div>
                <div className={`flex justify-between items-start mb-2`}>
                  <CardTitle className={`text-lg font-semibold flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {type.title}
                  </CardTitle>
                  {getStatusBadge(type.status)}
                </div>
                <CardDescription className={`text-sm text-muted-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  {type.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className={`font-medium text-sm text-muted-foreground mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t.features}:
                    </h4>
                    <ul className={`text-xs text-muted-foreground space-y-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {type.features.map((feature, index) => (
                        <li key={index} className={`flex items-center`}>
                          <span className={`w-1.5 h-1.5 bg-primary rounded-full mt-1.5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full mt-4 btn-primary"
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



        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          <p>
            {t.moreGames}
          </p>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
};

export default GameTypeSelector;