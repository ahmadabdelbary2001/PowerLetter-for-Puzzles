// src/components/molecules/TeamDisplay.tsx
/**
 * TeamDisplay is a molecule component that displays team information in a competitive game mode.
 * It shows team names, scores, and remaining hints. The current team is highlighted to indicate
 * whose turn it is. The component is flexible and can show or hide hints and scores based on props.
 */
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { Team } from "@/types/game";

/**
 * Props for the TeamDisplay component
 * @interface TeamDisplayProps
 * @property {Team[]} teams - Array of team objects containing team information
 * @property {number} currentTeam - Index of the currently active team
 * @property {boolean} [showHints=true] - Whether to display remaining hints for each team
 * @property {boolean} [showScore=true] - Whether to display scores for each team
 * @property {string} [className] - Optional CSS class for styling
 */
interface TeamDisplayProps {
  teams: Team[];
  currentTeam: number;
  showHints?: boolean;
  showScore?: boolean;
  className?: string;
}

/**
 * TeamDisplay component that renders team information in competitive mode
 * @param {TeamDisplayProps} props - Component props
 * @returns {JSX.Element} The rendered TeamDisplay component
 */
export function TeamDisplay({ 
  teams, 
  currentTeam, 
  showHints = true, 
  showScore = true,
  className 
}: TeamDisplayProps) {
  // Get translation function for localized text
  const { t } = useTranslation();

  return (
    /* Container for team display elements */
    <div className={cn("flex flex-wrap gap-2 items-center", className)}>
      {/* Map through teams and render each team */}
      {teams.map((team, idx) => (
        <div key={team.id} className="flex items-center gap-2">
          {/* Team badge with name and score - highlighted for current team */}
          <Badge variant={idx === currentTeam ? "default" : "secondary"} className="px-3">
            {team.name}
            {showScore && `: ${team.score} ${t('points', { ns: 'team' })}`}
          </Badge>
          {/* Show hints remaining if enabled */}
          {showHints && (
            /* Hints remaining indicator with lightbulb icon */
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
