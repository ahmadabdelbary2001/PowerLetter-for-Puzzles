// src/components/molecules/TeamDisplay.tsx
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { Team } from "@/types/game";

interface TeamDisplayProps {
  teams: Team[];
  currentTeam: number;
  showHints?: boolean;
  showScore?: boolean;
  className?: string;
}

export function TeamDisplay({ 
  teams, 
  currentTeam, 
  showHints = true, 
  showScore = true,
  className 
}: TeamDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {teams.map((team, idx) => (
        <div key={team.id} className="flex items-center gap-2">
          <Badge variant={idx === currentTeam ? "default" : "secondary"} className="px-3">
            {team.name}
            {showScore && `: ${team.score} ${t.points}`}
          </Badge>
          {showHints && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
              {team.hintsRemaining}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
