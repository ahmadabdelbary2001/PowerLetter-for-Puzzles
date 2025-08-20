// src/components/molecules/Scoreboard.tsx
/**
 * Scoreboard is a molecule component that displays team scores and hints remaining
 * in a competitive game mode. It highlights the currently active team and shows
 * each team's current score and available hints.
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import type { Team } from '@/types/game';

/**
 * Props for the Scoreboard component
 * @interface ScoreboardProps
 * @property {Team[]} teams - Array of team objects containing team information
 * @property {number} currentTeam - Index of the currently active team
 */
interface ScoreboardProps {
  teams: Team[];
  currentTeam: number;
}

/**
 * Scoreboard component that displays team scores and hints in competitive mode
 * @param {ScoreboardProps} props - Component props
 * @returns {JSX.Element} The rendered Scoreboard component
 */
export const Scoreboard: React.FC<ScoreboardProps> = ({ teams, currentTeam }) => {
  // Get translation function for localized text
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        {/* Title of the scoreboard */}
        <CardTitle className="text-center">{t.scoreboard}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {/* Render each team as a row in the scoreboard */}
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
