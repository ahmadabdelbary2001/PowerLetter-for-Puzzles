// src/components/GameScreens/GameLayout.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Lightbulb } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  levelIndex: number;
  onBack: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, title, levelIndex, onBack }) => {
  const { gameMode, teams, currentTeam } = useGameMode();
  const { t, dir } = useTranslation();

  return (
    <>
      <Header currentView="play" showLanguage={false} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
          {/* Top Bar: Back Button & Team Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
            </Button>
            {gameMode === "competitive" && teams.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end w-full sm:w-auto">
                {teams.map((team, idx) => (
                  <Badge key={team.id} variant={idx === currentTeam ? "default" : "secondary"} className="px-3">
                    {team.name}: {team.score}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Main Game Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-center flex-1">{title}</CardTitle>
                <Badge variant="secondary">{t.level} {levelIndex + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {children}
            </CardContent>
          </Card>

          {/* Scoreboard for Competitive Mode */}
          {gameMode === 'competitive' && teams.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-center">{t.scoreboard}</CardTitle></CardHeader>
              <CardContent className="grid gap-2">
                {teams.map((team, index) => (
                  <div key={team.id} className={cn("flex justify-between items-center p-3 rounded-lg", index === currentTeam ? "bg-primary/20" : "bg-muted")}>
                    <span className="font-medium">{team.name} {index === currentTeam && `(${t.currentTurn})`}</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{team.score} {t.points}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                        {team.hintsRemaining}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};
