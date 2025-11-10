/**
 * KidsGameSelector.tsx
 * Playful, modern styling for the kids selection page.
 */
import React from 'react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from 'react-router-dom';
import { GAME_REGISTRY, type GameConfig } from '@/games/GameRegistry';
import { GameSelectionPageLayout } from '@/components/templates/GameSelectionPageLayout';
import { GameSelectionCard } from '@/components/molecules/GameSelectionCard';

const KidsGameSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const kidsGames = GAME_REGISTRY.filter(game => game.type === 'kids');

  const handleGameSelect = (gameId: GameConfig['id']) => {
    setGameType(gameId);
    navigate(`/game-mode/${gameId}`);
  };

  return (
    <GameSelectionPageLayout
      pageTitle={
        <div className="flex items-center justify-center mb-4 gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold ml-1 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-yellow-400 to-pink-400">
            {t('kidsGamesTitle', { ns: 'games' })}
          </h1>
        </div>
      }
      pageDescription={t('kidsGamesDesc', { ns: 'games' })}
      // bright, playful gradient background (keeps green + yellow)
      backgroundClass="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-50 via-yellow-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800"
      headerView="kids"
      // tell the layout to show the playful blobs for kids
    >
      {kidsGames.map((game) => (
        <GameSelectionCard
          key={game.id}
          game={game}
          isSelected={gameType === game.id}
          onSelect={handleGameSelect}
          themeColor="green-500"
        />
      ))}
    </GameSelectionPageLayout>
  );
};

export default KidsGameSelector;
