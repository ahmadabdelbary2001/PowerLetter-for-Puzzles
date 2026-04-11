"use client";

/**
 * @description This page displays a selection of games for the main (adult) category.
 * Shared version for all monorepo apps.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 */
import React from 'react';
import { useGameMode, useTranslation } from '@powerletter/core';
import { GameSelectionPageLayout } from '@/templates/GameSelectionPageLayout';
import { GameSelectionCard } from '@/molecules/GameSelectionCard';
import { GAME_REGISTRY, type GameConfig } from '../registry/GameRegistry';
import { useAppRouter } from '../contexts/RouterContext';

const GameTypeSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const router = useAppRouter();

  const adultGames = GAME_REGISTRY.filter(game => game.type === 'adult');

  const handleGameTypeSelect = (typeId: GameConfig['id']): void => {
    setGameType(typeId);
    router.push(`/game-mode/${typeId}`);
  };

  return (
    <GameSelectionPageLayout
      pageTitle={
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent mb-4 bg-linear-to-r from-primary to-primary/60">
          {t('selectGame', { ns: 'games' })}
        </h1>
      }
      pageDescription={t('selectGameDesc', { ns: 'games' })}
      backgroundClass="bg-linear-to-br from-background via-background to-muted/10 dark:from-slate-900 dark:to-slate-800"
      headerView="selection"
    >
      {adultGames.map((game) => (
        <GameSelectionCard
          key={game.id}
          game={game}
          isSelected={gameType === game.id}
          onSelect={handleGameTypeSelect}
          themeColor="primary"
        />
      ))}
    </GameSelectionPageLayout>
  );
};

export default GameTypeSelector;
