// src/components/templates/GameLayout.tsx
/**
 * GameLayout is a template component that provides the main layout structure for game screens.
 * It includes the header, navigation controls, team information, and a card container for game content.
 * The layout adapts based on game mode (competitive vs single-player) and supports RTL/LTR languages.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/organisms/Header';
import { Scoreboard } from '@/components/molecules/Scoreboard';
import { TeamDisplay } from '@/components/molecules/TeamDisplay';

/**
 * Props for the GameLayout component
 * @interface GameLayoutProps
 * @property {React.ReactNode} children - The game content to be rendered inside the main card
 * @property {string} title - The title of the current game/level
 * @property {number} levelIndex - The index of the current level (0-based)
 * @property {() => void} onBack - Callback function triggered when the back button is clicked
 */
interface GameLayoutProps {
  children: React.ReactNode;
  title: string;
  levelIndex: number;
  onBack: () => void;
}

/**
 * GameLayout component that provides a consistent layout for all game screens
 * @param {GameLayoutProps} props - Component props
 * @returns {JSX.Element} The rendered GameLayout component
 */
export const GameLayout: React.FC<GameLayoutProps> = ({ children, title, levelIndex, onBack }) => {
  // Get game mode information (teams, current team, etc.)
  const { gameMode, teams, currentTeam } = useGameMode();
  // Get translation function and text direction (for RTL support)
  const { t, dir } = useTranslation();

  return (
    <>
      {/* App header without language selector */}
      <Header currentView="play" showLanguage={false} />
      {/* Main container with gradient background and responsive padding */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6" dir={dir}>
        <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6">
          {/* Top Bar: Back Button & Team Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Back button with appropriate arrow direction based on text direction */}
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              {dir === "rtl" ? <ArrowRight /> : <ArrowLeft />} {t.back}
            </Button>
            {/* Show team information only in competitive mode */}
            {gameMode === "competitive" && teams.length > 0 && (
              <TeamDisplay teams={teams} currentTeam={currentTeam} showScore={true} />
            )}
          </div>

          {/* Main Game Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-center flex-1">{title}</CardTitle>
                {/* Level indicator badge */}
                <Badge variant="secondary">{t.level} {levelIndex + 1}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Render the game content passed as children */}
              {children}
            </CardContent>
          </Card>

          {/* Scoreboard for Competitive Mode - only shown in competitive mode */}
          {gameMode === 'competitive' && teams.length > 0 && (
            <Scoreboard teams={teams} currentTeam={currentTeam} />
          )}
        </div>
      </div>
    </>
  );
};
