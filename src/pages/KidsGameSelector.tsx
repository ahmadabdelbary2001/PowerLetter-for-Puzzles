// src/pages/KidsGameSelector.tsx
/**
 * @description This page displays a selection of games specifically designed for children.
 * It fetches game configurations from the `GAME_REGISTRY`, filters for 'kids' games,
 * and renders them with a more playful and colorful UI theme.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ToyBrick, Lock } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import { useNavigate } from 'react-router-dom';
import { GAME_REGISTRY, type GameConfig } from '@/games/GameRegistry';
import { cn } from '@/lib/utils';
// --- The i18nUtils helper is no longer needed. ---

/**
 * The KidsGameSelector component provides a curated list of games suitable for children.
 * It uses a distinct visual style to differentiate it from the main game selection screen.
 *
 * @returns {JSX.Element} The rendered kids' game selection page.
 */
const KidsGameSelector: React.FC = () => {
  // Hooks for global state, translation, and navigation
  const { gameType, setGameType } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;
  const navigate = useNavigate();

  // Filter the central registry to get only kids' games
  const kidsGames = GAME_REGISTRY.filter(game => game.type === 'kids');

  /**
   * Handles the selection of a kids' game.
   * Updates the global state and navigates to the game mode configuration screen.
   * @param {GameConfig['id']} gameId - The ID of the selected game.
   */
  const handleGameSelect = (gameId: GameConfig['id']) => {
    setGameType(gameId);
    navigate(`/game-mode/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentView="kids" />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-8 max-w-6xl" dir={dir}>
          {/* Page Header with playful icon */}
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center mb-4">
              <ToyBrick className="w-10 h-10 text-green-600 dark:text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold dark:text-white ml-3 mr-3 bg-gradient-to-r from-green-500 to-yellow-500 bg-clip-text text-transparent">
                {/* --- Use new function syntax with namespace --- */}
                {t('kidsGamesTitle', { ns: 'games' })}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {/* --- Use new function syntax with namespace --- */}
              {t('kidsGamesDesc', { ns: 'games' })}
            </p>
          </div>

          {/* Game Cards Grid with kid-friendly styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {kidsGames.map((game) => {
              // --- Directly fetch the features array from the 'games' namespace ---
              const features = t(game.featuresKey, { ns: 'games', returnObjects: true }) as string[];

              return (
                <Card
                  key={game.id}
                  className={cn(
                    "relative transition-all duration-300 hover:shadow-lg",
                    game.status === 'available'
                      ? 'hover:scale-[1.02] cursor-pointer border-green-500/20 bg-gradient-to-br from-card to-card/80'
                      : 'opacity-75 cursor-not-allowed',
                    gameType === game.id && game.status === 'available' && 'ring-2 ring-green-500/50 bg-green-500/5 dark:bg-green-500/10'
                  )}
                  onClick={() => game.status === 'available' && handleGameSelect(game.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4 text-green-500">
                      <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
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
                              <span className={`w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 ${dir === 'rtl' ? 'ml-3' : 'mr-3'}`}></span>
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
                        {/* --- Use new function syntax (default ns is 'common') --- */}
                        {game.status === 'available' ? t('playNow') : t('comingSoon')}
                        {game.status !== 'available' && <Lock className="w-4 h-4 ml-2" />}
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

export default KidsGameSelector;
