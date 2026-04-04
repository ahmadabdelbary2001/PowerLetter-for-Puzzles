// src/components/templates/ClueGameLayout.tsx
/**
 * @description A reusable layout template for clue-based puzzle games.
 * This template standardizes the page structure for games like Phrase Clue and
 * Image Clue, providing named slots for a prompt, a solution display, a letter
 * grid/options, and game controls.
 */
import React from 'react';
import { GameLayout } from './GameLayout';
import type { NotificationData } from '../atoms/Notification';
import type { Difficulty } from '@powerletter/core';

/**
 * @interface ClueGameLayoutProps
 * @description Props for the ClueGameLayout component.
 * It defines all required props for the layout template.
 */
interface ClueGameLayoutProps {
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: Difficulty;
  instructions?: { title: string; description: string; steps: string[] };
  notification: NotificationData | null;
  onClearNotification: () => void;
  layoutType?: 'text' | 'image';
  promptContent?: React.ReactNode;
  solutionContent: React.ReactNode;
  letterOptionsContent: React.ReactNode;
  wrongAnswersContent?: React.ReactNode;
  gameControlsContent: React.ReactNode;
}

export const ClueGameLayout: React.FC<ClueGameLayoutProps> = ({
  promptContent,
  solutionContent,
  letterOptionsContent,
  wrongAnswersContent,
  gameControlsContent,
  // --- Gather all other props to pass to GameLayout ---
  ...gameLayoutProps
}) => {
  const { layoutType = 'text' } = gameLayoutProps;

  return (
    // --- Spread the gathered props onto the GameLayout component ---
    <GameLayout {...gameLayoutProps}>
      <div className="flex flex-col items-center gap-6">
        {/* Slot for the main game prompt (e.g., an image or text clue) */}
        {promptContent && (
          <div className="w-full max-w-md">
            {promptContent}
          </div>
        )}

        {/* Slot for displaying the current solution progress (e.g., SolutionBoxes) */}
        <div className="w-full">
          {solutionContent}
        </div>

        {/* Slot for the letter selection component (e.g., LetterGrid) */}
        <div className="w-full">
          {letterOptionsContent}
        </div>

        {/* Optional slot for displaying a list of previous incorrect guesses */}
        {wrongAnswersContent && (
          <div className="w-full">
            {wrongAnswersContent}
          </div>
        )}

        {/* Slot for the main game controls */}
        <div className="flex w-full justify-center mt-4">
          {gameControlsContent}
        </div>
      </div>
    </GameLayout>
  );
};
