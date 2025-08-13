// src/pages/KidsGameSelector.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToyBrick, SpellCheck, CheckSquare, Image, Lock } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import type { GameType as GameModeType } from '@/types/game';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface KidsGame {
  id: GameModeType;
  title: string;
  description: string;
  icon: JSX.Element;
  status: 'available' | 'coming_soon';
  features: readonly string[];
}

const KidsGameSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();

  const kidsGameTypes: KidsGame[] = [
    {
      id: 'image-clue',
      title: t.imageClueTitle,
      description: t.imageClueDesc,
      icon: <SpellCheck className="w-8 h-8" />,
      status: 'available',
      features: t.imageClueFeatures,
    },
    {
      id: 'word-choice',
      title: t.wordChoiceTitle,
      description: t.wordChoiceDesc,
      icon: <CheckSquare className="w-8 h-8" />,
      status: 'coming_soon',
      features: t.wordChoiceFeatures,
    },
    {
      id: 'picture-choice',
      title: t.pictureChoiceTitle,
      description: t.pictureChoiceDesc,
      icon: <Image className="w-8 h-8" />,
      status: 'coming_soon',
      features: t.pictureChoiceFeatures,
    },
  ];

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case 'available':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">{t.available}</Badge>;
      case 'coming_soon':
        return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">{t.comingSoon}</Badge>;
      default:
        return <Badge variant="outline">{t.unknown}</Badge>;
    }
  };

  const handleGameTypeSelect = (typeId: GameModeType): void => {
    setGameType(typeId);
    // All kids games are single-player for now, so we go to category selection
    navigate(`/game-mode/${typeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentView="kids" />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-8 max-w-6xl" dir={dir}>
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4">
              <ToyBrick className="w-10 h-10 text-green-600 dark:text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold dark:text-white ml-3 mr-3 bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                {t.kidsGamesTitle}
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t.kidsGamesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kidsGameTypes.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "relative transition-all duration-300 hover:shadow-lg",
                  type.status === 'available'
                    ? 'hover:scale-[1.02] cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/80'
                    : 'opacity-75 cursor-not-allowed',
                  gameType === type.id && type.status === 'available' && 'ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10'
                )}
                onClick={() => type.status === 'available' && handleGameTypeSelect(type.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 text-primary dark:text-primary/80">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {type.icon}
                    </div>
                  </div>
                  <div className="flex justify-between items-start mb-2">
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
                      className="w-full mt-4"
                      disabled={type.status !== 'available'}
                      variant={type.status === 'available' ? 'default' : 'secondary'}
                    >
                      {type.status === 'available' ? (
                        <>{t.playNow}</>
                      ) : (
                        <><Lock className="w-4 h-4 mr-2" />{t.comingSoon}</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            <p>{t.moreGames}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KidsGameSelector;
