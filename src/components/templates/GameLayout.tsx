// src/components/templates/GameLayout.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import { Scoreboard } from '@/components/molecules/Scoreboard';
import { TeamDisplay } from '@/components/molecules/TeamDisplay';
import GameInstructions from '@/components/molecules/GameInstructions';
import { InGameSettings } from '@/components/molecules/InGameSettings';
import type { Difficulty } from '@/types/game';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: Difficulty;
  layoutType?: 'text' | 'image';
  instructions?: {
    title: string;
    description: string;
    steps: string[];
  };
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  title,
  levelIndex,
  onBack,
  difficulty,
  layoutType = 'text',
  instructions,
}) => {
  const { gameMode, teams, currentTeam } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <>
      <Header currentView="play" showLanguage={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div
          className={cn(
            "mx-auto space-y-4 sm:space-y-6",
            layoutType === 'image' ? 'max-w-xl' : 'max-w-5xl'
          )}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
              </Button>
              {instructions && <GameInstructions instructions={instructions} />}
            </div>
            <div className="flex items-center gap-3">
              {gameMode === "competitive" && teams.length > 0 && (
                <TeamDisplay teams={teams} currentTeam={currentTeam} showScore={true} />
              )}
              {/* ADDED: In-game settings button for competitive mode */}
              {gameMode === "competitive" && <InGameSettings />}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                {difficulty && (
                  <Badge variant={difficulty === 'easy' ? 'default' : difficulty === 'medium' ? 'secondary' : 'destructive'}>
                    {t[difficulty]}
                  </Badge>
                )}
                <CardTitle className="text-center flex-1 px-4">{title}</CardTitle>
                <Badge variant="secondary">{t.level} {levelIndex + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent className={cn(layoutType === 'image' ? 'space-y-4' : 'space-y-6')}>
              {children}
            </CardContent>
          </Card>

          {gameMode === 'competitive' && teams.length > 0 && (
            <Scoreboard teams={teams} currentTeam={currentTeam} />
          )}
        </div>
      </div>
    </>
  );
};
