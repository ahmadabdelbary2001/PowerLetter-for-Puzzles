"use client";

/**
 * @description Page for selecting kids' games.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import React from 'react';
import { useGameMode, useTranslation, type GameType } from '@powerletter/core';
import { GameSelectionPageLayout } from '../templates/GameSelectionPageLayout';
import { GameSelectionCard } from '../molecules/GameSelectionCard';
import { useAppRouter } from '../contexts/RouterContext';
import { GAME_REGISTRY } from '../registry/GameRegistry';

const KidsGameSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const router = useAppRouter();

  const handleGameSelect = (id: string) => {
    setGameType(id as GameType);
    router.push(`/game-mode/${id}`);
  };

  const games = GAME_REGISTRY.filter((g: { type: string }) => g.type === 'kids');

  return (
    <GameSelectionPageLayout
      pageTitle={
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-green-500 via-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4 leading-tight">
          {t('kidsGames', { ns: 'selection' })}
        </h1>
      }
      pageDescription={t('kidsSelectionDesc', { ns: 'selection' })}
      backgroundClass="bg-mesh"
      headerView="kids"
    >
      {games.map((game) => (
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
