// src/components/templates/FlowGameLayout.tsx
/**
 * @description A reusable layout template for board-based or "flow" style games.
 * This template standardizes the page structure, including the main game layout,
 * notification display, and slots for game-specific content like the board,
 * found words, progress, and controls.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import type { NotificationData } from '@/components/atoms/Notification';

/**
 * @interface FlowGameLayoutProps
 * @description Props for the FlowGameLayout component.
 * It extends the base GameLayoutProps and adds slots for game-specific content.
 */
interface FlowGameLayoutProps extends React.ComponentProps<typeof GameLayout> {
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  instructions?: { title: string; description: string; steps: string[] };
  notification: NotificationData | null;
  onClearNotification: () => void;
  boardContent: React.ReactNode;
  foundWordsContent?: React.ReactNode;
  progressContent?: React.ReactNode;
  gameControlsContent: React.ReactNode;
  children: React.ReactNode;
}

export const FlowGameLayout: React.FC<FlowGameLayoutProps> = ({
  boardContent,
  foundWordsContent,
  progressContent,
  gameControlsContent,
  notification,
  onClearNotification,
  children,
  ...gameLayoutProps // Gather all other props for GameLayout
}) => {
  return (
    // Spread the gathered props onto the GameLayout component
    <GameLayout {...gameLayoutProps} notification={notification} onClearNotification={onClearNotification}>
      {children}
      {/* Main content area for the game */}
      <div className="flex flex-col items-center gap-4">
        {/* Slot for the main game board */}
        <div className="w-full touch-none transition-colors duration-300">
          {boardContent}
        </div>

        {/* Slot for displaying found words */}
        {foundWordsContent}

        {/* Slot for the main game controls */}
        <div className="w-full max-w-md">
          {gameControlsContent}
        </div>

        {/* Slot for displaying game progress */}
        {progressContent}
      </div>
    </GameLayout>
  );
};
