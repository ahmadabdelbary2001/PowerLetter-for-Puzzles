// src/components/templates/WordFormationLayout.tsx
/**
 * @description A reusable layout template for word formation style games.
 * This template standardizes the page structure, including the main game layout,
 * notification display, and provides named slots for game-specific content like
 * a grid, an input display, a letter selector, and game controls.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import type { NotificationData } from '@/components/atoms/Notification';

/**
 * @interface WordFormationLayoutProps
 * @description Props for the WordFormationLayout component.
 * It extends the base GameLayoutProps and adds slots for game-specific content.
 */
// --- Use React.ComponentProps to correctly infer the props from GameLayout ---
interface WordFormationLayoutProps extends Omit<React.ComponentProps<typeof GameLayout>, 'children'> {
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  instructions?: { title: string; description: string; steps: string[] };
  notification: NotificationData | null;
  onClearNotification: () => void;
  gridContent: React.ReactNode;
  inputDisplayContent: React.ReactNode;
  letterSelectorContent: React.ReactNode;
  gameControlsContent: React.ReactNode;
}

export const WordFormationLayout: React.FC<WordFormationLayoutProps> = ({
  gridContent,
  inputDisplayContent,
  letterSelectorContent,
  gameControlsContent,
  // --- Use the rest operator to gather all other props for GameLayout ---
  ...gameLayoutProps
}) => {
  return (
    // --- Spread the gathered props onto the GameLayout component ---
    // This ensures `title`, `levelIndex`, `onBack`, etc., are all passed correctly.
    <GameLayout {...gameLayoutProps}>
      {/* Main content area for the game, arranged vertically */}
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        {/* Slot for the main game grid (e.g., CrosswordGrid) */}
        {gridContent}

        {/* Slot for displaying the current word being formed */}
        <div className="h-8 sm:h-10 flex justify-center items-center mb-1 sm:mb-2">
          {inputDisplayContent}
        </div>

        {/* Slot for the letter selection component (e.g., LetterCircle) */}
        {letterSelectorContent}

        {/* Slot for the main game controls */}
        <div className="flex w-full max-w-xs justify-center gap-1 sm:gap-2 px-1 flex-wrap sm:flex-nowrap items-center">
          {gameControlsContent}
        </div>
      </div>
    </GameLayout>
  );
};
