// src/components/templates/FlowGameLayout.tsx
/**
 * @description A reusable layout template for board-based or "flow" style games.
 * This template standardizes the page structure, including the main game layout,
 * notification display, and slots for game-specific content like the board,
 * found words, progress, and controls.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { Notification } from '@/components/atoms/Notification';

// Define the Notification type locally to match the state from the hook.
type NotificationType = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

/**
 * @interface FlowGameLayoutProps
 * @description Props for the FlowGameLayout component.
 * It extends the base GameLayoutProps and adds slots for game-specific content.
 */
interface FlowGameLayoutProps extends Omit<React.ComponentProps<typeof GameLayout>, 'children'> {
  notification: NotificationType | null;
  boardContent: React.ReactNode;
  foundWordsContent?: React.ReactNode;
  progressContent?: React.ReactNode;
  gameControlsContent: React.ReactNode;
}

export const FlowGameLayout: React.FC<FlowGameLayoutProps> = ({
  notification,
  boardContent,
  foundWordsContent,
  progressContent,
  gameControlsContent,
  ...gameLayoutProps // Gather all other props for GameLayout
}) => {
  // Determine the notification message and type.
  const notifMessage = notification?.message ?? null;
  const notifType = notification?.type ?? 'info';

  return (
    // Spread the gathered props onto the GameLayout component
    <GameLayout {...gameLayoutProps}>
      {/* Slot for the notification */}
      {notifMessage && <Notification message={notifMessage} type={notifType} />}

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
