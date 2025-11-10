// src/pages/GameTypeSelector.tsx
/**
 * @description This page displays a selection of games for the main (adult) category.
 * It fetches game configurations from the `GAME_REGISTRY`, filters for 'adult' games,
 * and renders them as a grid of interactive cards. Users can select an available game
 * to proceed to the game mode configuration screen.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Search } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import { useNavigate } from 'react-router-dom';
import { GAME_REGISTRY, type GameConfig } from '@/games/GameRegistry';
import { cn } from '@/lib/utils';
// --- The i18nUtils helper is no longer needed. ---

/**
 * The GameTypeSelector component renders a list of available games.
 * It handles user interaction for selecting a game and navigating to the next step.
 * Games marked as 'coming-soon' are displayed but disabled.
 *
 * @returns {JSX.Element} The rendered game selection page.
 */
const GameTypeSelector: React.FC = () => {
  // Hooks for global state, translation, and navigation
  const { gameType, setGameType } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;
  const navigate = useNavigate();

  // Filter the central registry to get only adult games
  const adultGames = GAME_REGISTRY.filter(game => game.type === 'adult');

  /**
   * Handles the selection of a game type.
   * It updates the global state with the selected game ID and navigates
   * to the game mode selection screen for that game.
   * @param {GameConfig['id']} typeId - The ID of the selected game.
   */
  const handleGameTypeSelect = (typeId: GameConfig['id']): void => {
    setGameType(typeId);
    navigate(`/game-mode/${typeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="selection" />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-8 max-w-6xl" dir={dir}>
          {/* Page Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              {/* --- Use new function syntax with namespace --- */}
              {t('selectGame', { ns: 'games' })}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {/* --- Use new function syntax with namespace --- */}
              {t('selectGameDesc', { ns: 'games' })}
            </p>
          </div>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {adultGames.map((game) => {
              // --- Directly fetch the features array from the 'games' namespace ---
              const features = t(game.featuresKey, { ns: 'games', returnObjects: true }) as string[];

              return (
                <Card
                  key={game.id}
                  className={cn(
                    "relative transition-all duration-300 hover:shadow-lg",
                    game.status === 'available'
                      ? 'hover:scale-[1.02] cursor-pointer border-primary/20 bg-gradient-to-br from-card to-card/80'
                      : 'opacity-75 cursor-not-allowed',
                    gameType === game.id && game.status === 'available' && 'ring-2 ring-primary/50 bg-primary/5 dark:bg-primary/10'
                  )}
                  onClick={() => game.status === 'available' && handleGameTypeSelect(game.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4 text-primary">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        {game.icon}
                      </div>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className={`text-lg font-semibold flex-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {/* --- Use new function syntax with namespace --- */}
                        {t(game.titleKey, { ns: 'games' })}
                      </CardTitle>
                      <Badge variant={game.status === 'available' ? 'default' : 'secondary'} className={game.status === 'available' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}>
                        {/* --- Use new function syntax (default ns is 'common') --- */}
                        {t(game.status)}
                      </Badge>
                    </div>
                    <CardDescription className={`text-sm text-muted-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                      {/* --- Use new function syntax with namespace --- */}
                      {t(game.descriptionKey, { ns: 'games' })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className={`font-medium text-sm text-muted-foreground mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          {/* --- Use new function syntax (default ns is 'common') --- */}
                          {t('features')}:
                        </h4>
                        <ul className={`text-xs text-muted-foreground space-y-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <span className={`w-1.5 h-1.5 bg-primary rounded-full mt-1.5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full mt-4"
                        disabled={game.status !== 'available'}
                        variant={game.status === 'available' ? 'default' : 'secondary'}
                      >
                        {game.status === 'available' ? (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            {/* --- Use new function syntax (default ns is 'common') --- */}
                            {t('playNow')}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            {/* --- Use new function syntax (default ns is 'common') --- */}
                            {t('comingSoon')}
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            {/* --- Use new function syntax with namespace --- */}
            <p>{t('moreGames', { ns: 'games' })}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GameTypeSelector;
