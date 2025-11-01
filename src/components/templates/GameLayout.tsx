// src/components/templates/GameLayout.tsx
/**
 * @description A template component that provides the main layout structure for game screens.
 * It includes the header, navigation controls, team information, and a card container for game content.
 * The layout adapts based on game mode, content type, and supports RTL/LTR languages.
 */
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
import type { Difficulty } from '@/types/game';
import { cn } from '@/lib/utils';

/**
 * Props for the GameLayout component
 * @interface GameLayoutProps
 * @property {React.ReactNode} children - The game content to be rendered inside the main card.
 * @property {string} title - The title of the current game/level.
 * @property {number} levelIndex - The index of the current level (0-based).
 * @property {() => void} onBack - Callback function triggered when the back button is clicked.
 * @property {Difficulty} [difficulty] - Optional: The difficulty of the current level to display a badge.
 * @property {'text' | 'image'} [layoutType='text'] - Optional: The type of layout to use. 'image' uses a narrower container and less spacing.
 */
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

/**
 * GameLayout component that provides a consistent layout for all game screens.
 * @param {GameLayoutProps} props - Component props.
 * @returns {JSX.Element} The rendered GameLayout component.
 */
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
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;

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
              {instructions && (
                <GameInstructions instructions={instructions} />
              )}
            </div>
            {gameMode === "competitive" && teams.length > 0 && (
              <TeamDisplay teams={teams} currentTeam={currentTeam} showScore={true} />
            )}
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
            {/*
              * FIX: The CardContent now uses conditional spacing.
              * It applies 'space-y-4' for image layouts and 'space-y-6' for text layouts.
              */}
            <CardContent className={cn(
              layoutType === 'image' ? 'space-y-4' : 'space-y-6'
            )}>
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
