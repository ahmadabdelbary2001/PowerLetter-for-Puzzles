"use client";

/**
 * KidsGameSelector.tsx
 * Playful, modern styling for the kids selection page.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import React from 'react';
import { useGameMode, useTranslation } from '@powerletter/core';
import { GameSelectionPageLayout } from '@ui/templates/GameSelectionPageLayout';
import { GameSelectionCard } from '@ui/molecules/GameSelectionCard';
import { GAME_REGISTRY, type GameConfig } from '@ui/registry/GameRegistry';
import { useAppRouter } from '@ui/contexts/RouterContext';

const KidsGameSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const router = useAppRouter();

  const kidsGames = GAME_REGISTRY.filter(game => game.type === 'kids');

  const handleGameSelect = (gameId: GameConfig['id']) => {
    setGameType(gameId);
    router.push(`/game-mode/${gameId}`);
  };

  return (
    <GameSelectionPageLayout
      pageTitle={
        <div className="flex items-center justify-center mb-4 gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold ml-1 bg-clip-text text-transparent bg-linear-to-r from-green-600 via-yellow-400 to-pink-400">
            {t('kidsGamesTitle', { ns: 'games' })}
          </h1>
        </div>
      }
      pageDescription={t('kidsGamesDesc', { ns: 'games' })}
      // bright, playful gradient background (keeps green + yellow)
      backgroundClass="bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-50 via-yellow-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800"
      headerView="kids"
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
