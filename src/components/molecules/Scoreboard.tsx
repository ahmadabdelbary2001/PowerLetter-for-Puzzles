// src/components/molecules/Scoreboard.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Team } from '@/types/game';

interface ScoreboardProps {
  teams: Team[];
  currentTeam: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ teams, currentTeam }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{t.scoreboard}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {teams.map((team, index) => (
          <div 
            key={team.id} 
            className={cn(
              "flex justify-between items-center p-3 rounded-lg", 
              index === currentTeam ? "bg-primary/20" : "bg-muted"
            )}
          >
            <span className="font-medium">
              {team.name} {index === currentTeam && `(${t.currentTurn})`}
            </span>
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
  );
};
