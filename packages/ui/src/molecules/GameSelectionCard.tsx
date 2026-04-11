"use client";

/**
 * Purpose: A reusable presentational component for displaying a single game card.
 * Shared version for all monorepo apps.
 * Restored to original styling from PowerLetter-for-Puzzles-old.
 *
 * @description
 * This component handles displaying the game's icon, title, description, features, and status.
 * Optimized for a premium feel with hover animations and specific theme coloring.
 */
import React from 'react';
import { Button } from '@/atoms/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/atoms/Card';
import { Badge } from '@/atoms/Badge';
import { Lock, Search, CheckCircle, Star } from 'lucide-react';
import { cn } from "../lib/utils";
import type { GameConfig } from '../registry/GameRegistry';
import { useTranslation } from '@powerletter/core';

interface GameSelectionCardProps {
  game: GameConfig;
  isSelected: boolean;
  onSelect: (id: GameConfig['id']) => void;
  themeColor: 'primary' | 'green-500';
}

export const GameSelectionCard: React.FC<GameSelectionCardProps> = ({ game, isSelected, onSelect, themeColor }) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  
  // Use typed translations for featuresArray if possible, or fallback safely
  const rawFeatures = t(game.featuresKey, { ns: 'games', returnObjects: true });
  const features = Array.isArray(rawFeatures) ? rawFeatures : [];

  // Theme-aware Tailwind classes matching the original project's architecture
  const ringColorClass = themeColor === 'primary' ? 'ring-primary/50' : 'ring-green-500/50';
  const bgColorClass = themeColor === 'primary' ? 'bg-primary/5' : 'bg-green-500/5';
  const darkBgColorClass = themeColor === 'primary' ? 'dark:bg-primary/10' : 'dark:bg-green-500/10';
  const borderColorClass = themeColor === 'primary' ? 'border-primary/20' : 'border-green-500/20';
  const iconBgColorClass = themeColor === 'primary' ? 'bg-primary/10' : 'bg-green-500/10';
  const iconTextColorClass = themeColor === 'primary' ? 'text-primary' : 'text-green-500';
  const badgeColorClass = themeColor === 'primary' ? 'bg-primary' : 'bg-green-500';

  return (
    <Card
      key={game.id}
      className={cn(
        "relative flex flex-col transition-all duration-300 hover:shadow-xl group",
        game.status === 'available'
          ? 'hover:scale-105 cursor-pointer bg-card'
          : 'opacity-60 cursor-not-allowed bg-card',
        isSelected && game.status === 'available' && `ring-2 ${ringColorClass} ${bgColorClass} ${darkBgColorClass}`,
        borderColorClass
      )}
      onClick={() => game.status === 'available' && onSelect(game.id)}
    >
      {isSelected && (
        <div className={cn("absolute top-3 z-10", dir === 'rtl' ? 'left-3' : 'right-3')}>
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shadow-lg", badgeColorClass)}>
            <Star className="w-3.5 h-3.5 text-white fill-white" />
          </div>
        </div>
      )}

      <CardHeader className="text-center p-4">
        <div className={cn("flex justify-center mb-3", iconTextColorClass)}>
          <div className={cn(
            "w-14 h-14 rounded-lg flex items-center justify-center transition-all duration-300 shadow-md",
            "group-hover:scale-110 group-hover:rotate-6",
            iconBgColorClass
          )}>
            <span className="text-2xl">{game.icon}</span>
          </div>
        </div>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className={cn("text-md font-bold flex-1", dir === 'rtl' ? 'text-right' : 'text-left')}>
            {t(game.titleKey, { ns: 'games' })}
          </CardTitle>
          <Badge variant={game.status === 'available' ? 'default' : 'secondary'} className={cn("ml-2 text-xs", game.status === 'available' ? 'bg-green-500' : 'bg-yellow-500 text-white')}>
            {t(game.status, { ns: 'games' })}
          </Badge>
        </div>
        <CardDescription className={cn("text-sm text-muted-foreground text-justify leading-relaxed", dir === 'rtl' ? 'text-right' : 'text-left')}>
          {t(game.descriptionKey, { ns: 'games' })}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col grow p-4 pt-0 space-y-3">
        <div className="grow">
          <h4 className={cn("font-semibold text-xs text-muted-foreground mb-2", dir === 'rtl' ? 'text-right' : 'text-left')}>
            {t('features', { ns: 'games' })}:
          </h4>
          <ul className={cn("text-xs text-muted-foreground space-y-1.5", dir === 'rtl' ? 'text-right' : 'text-left')}>
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className={cn("w-4 h-4 mt-0.5 shrink-0", iconTextColorClass)} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          className="w-full mt-auto"
          size="sm"
          disabled={game.status !== 'available'}
          variant={game.status === 'available' ? 'default' : 'secondary'}
        >
          {game.status === 'available' ? (
            <>
              <Search className="w-4 h-4 mr-2" />
              {t('playNow', { ns: 'games' })}
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              {t('comingSoon', { ns: 'games' })}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
