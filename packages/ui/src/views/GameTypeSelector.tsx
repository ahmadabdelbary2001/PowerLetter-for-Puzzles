"use client";

/**
 * @description Page for selecting the specific game within a mode.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import React from 'react';
import { useGameMode, useTranslation, type GameType } from '@powerletter/core';
import { GameSelectionPageLayout } from '../templates/GameSelectionPageLayout';
import { GameSelectionCard } from '../molecules/GameSelectionCard';
import { useAppRouter } from '../contexts/RouterContext';
import { GAME_REGISTRY } from '../registry/GameRegistry';

const GameTypeSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const router = useAppRouter();

  const handleGameSelect = (id: string) => {
    setGameType(id as GameType);
    router.push(`/game-mode/${id}`);
  };

  const games = GAME_REGISTRY.filter((g: { type: string }) => g.type === 'adult');

  return (
    <GameSelectionPageLayout
      pageTitle={
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-linear-to-r from-primary via-primary-light to-secondary bg-clip-text text-transparent mb-4 leading-tight">
          {t('adultGames', { ns: 'selection' })}
        </h1>
      }
      pageDescription={t('gameSelectionDesc', { ns: 'selection' })}
      backgroundClass="bg-mesh"
      headerView="selection"
    >
      {games.map((game) => (
        <GameSelectionCard
          key={game.id}
          game={game}
          isSelected={gameType === game.id}
          onSelect={handleGameSelect}
          themeColor="primary"
        />
      ))}
    </GameSelectionPageLayout>
  );
};

export default GameTypeSelector;
