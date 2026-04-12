'use client';

import React, { Suspense } from 'react';
import { useAppParams, getGameConfig } from '@powerletter/ui';
import { useTranslation } from '@powerletter/core';
import { notFound } from 'next/navigation';

export default function GamePlayPage() {
  const { t } = useTranslation();
  const { gameType } = useAppParams<{ gameType?: string }>();
  
  // Look up the configuration for the active game type
  const config = getGameConfig(gameType);

  if (!config && gameType) {
    // If a gameType was provided but not found in the registry
    return notFound();
  }

  // Fallback UI or loading state
  if (!config) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('noGameSelected')}</h1>
        <p className="text-muted-foreground">{t('pleaseSelectGameDesc')}</p>
      </div>
    );
  }

  const { component: GameComponent } = config;

  return (
    <div className="relative min-h-screen bg-background">
      <Suspense 
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        {/* Render the specific game screen component (e.g., FormationGameScreen) */}
        <GameComponent />
      </Suspense>
    </div>
  );
}
