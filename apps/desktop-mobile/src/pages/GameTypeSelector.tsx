// src/pages/GameTypeSelector.tsx
/**
 * @description This page displays a selection of games for the main (adult) category.
 * It acts as a "container" component, fetching adult games from the registry and
 * passing them to the reusable GameSelectionPageLayout and GameSelectionCard components.
 */
import React from 'react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate } from 'react-router-dom';
import { GAME_REGISTRY, type GameConfig } from '@/games/GameRegistry';
import { GameSelectionPageLayout } from '@/components/templates/GameSelectionPageLayout';
import { GameSelectionCard } from '@/components/molecules/GameSelectionCard';

const GameTypeSelector: React.FC = () => {
  const { gameType, setGameType } = useGameMode();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const adultGames = GAME_REGISTRY.filter(game => game.type === 'adult');

  const handleGameTypeSelect = (typeId: GameConfig['id']): void => {
    setGameType(typeId);
    navigate(`/game-mode/${typeId}`);
  };

  return (
    <GameSelectionPageLayout
      pageTitle={
        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent mb-4 bg-gradient-to-r from-primary to-primary/60">
          {t('selectGame', { ns: 'games' })}
        </h1>
      }
      pageDescription={t('selectGameDesc', { ns: 'games' })}
      backgroundClass="bg-gradient-to-br from-background via-background to-muted/10 dark:from-slate-900 dark:to-slate-800"
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
