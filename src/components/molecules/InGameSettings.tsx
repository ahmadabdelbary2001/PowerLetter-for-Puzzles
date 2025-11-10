// src/components/molecules/InGameSettings.tsx
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings, Users, Layers, BarChart3 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useNavigate, useParams } from "react-router-dom";
import { getGameConfig } from '@/games/GameRegistry';
import { useGameMode } from '@/hooks/useGameMode';

export const InGameSettings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { gameMode } = useGameMode();
  const gameConfig = getGameConfig(gameType);

  const supportsTeams = gameConfig?.supportedSettings.includes('teams');
  const supportsDifficulty = gameConfig?.supportedSettings.includes('difficulty');
  const supportsCategory = gameConfig?.supportedSettings.includes('category');

  const showChangeTeams = supportsTeams && gameMode === 'competitive';
  const showChangeDifficulty = supportsDifficulty;
  const showChangeCategory = supportsCategory;

  const hasVisibleItems = showChangeTeams || showChangeDifficulty || showChangeCategory;
  if (!gameType || !hasVisibleItems) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('gameSettings', { ns: 'selection' })}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('gameSettings', { ns: 'selection' })}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* This now navigates to the dedicated settings route for teams */}
        {showChangeTeams && (
          <DropdownMenuItem onSelect={() => navigate(`/settings/teams/${gameType}`)}>
            <Users className="mr-2 h-4 w-4" />
            <span>{t('changeTeams', { ns: 'selection' })}</span>
          </DropdownMenuItem>
        )}

        {showChangeDifficulty && (
          <DropdownMenuItem onSelect={() => navigate(`/settings/difficulty/${gameType}`)}>
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>{t('changeLevel', { ns: 'selection' })}</span>
          </DropdownMenuItem>
        )}

        {showChangeCategory && (
          <DropdownMenuItem onSelect={() => navigate(`/settings/category/${gameType}`)}>
            <Layers className="mr-2 h-4 w-4" />
            <span>{t('changeCategory', { ns: 'selection' })}</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
