// src/components/templates/MultipleChoiceLayout.tsx
/**
 * @description A reusable layout template for multiple-choice style games.
 * This template standardizes the page structure for games that present a prompt
 * and a set of selectable options. It includes slots for the prompt, the options,
 * and a next button, along with a notification area.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import type { NotificationData } from '@/components/atoms/Notification';

/**
 * @interface MultipleChoiceLayoutProps
 * @description Props for the MultipleChoiceLayout component.
 * It defines all required props for the layout template.
 */
interface MultipleChoiceLayoutProps {
  title: string;
  levelIndex: number;
  onBack: () => void;
  notification: NotificationData | null;
  onClearNotification: () => void;
  promptContent: React.ReactNode;
  optionsContent: React.ReactNode;
  nextButtonContent?: React.ReactNode;
  instructions?: {
    title: string;
    description: string;
    steps: string[];
  };
}

export const MultipleChoiceLayout: React.FC<MultipleChoiceLayoutProps> = ({
  promptContent,
  optionsContent,
  nextButtonContent,
  // --- Gather all remaining props to pass to GameLayout ---
  ...gameLayoutProps
}) => {
  return (
    // --- Spread all props, including notification props, to GameLayout ---
    <GameLayout {...gameLayoutProps} layoutType="image">
      <div className="flex flex-col items-center justify-center h-full w-full p-4">
        {/* Slot for the main game prompt (e.g., a word or an image) */}
        <div className="w-full max-w-md mb-8">
          {promptContent}
        </div>

        {/* --- Restore the responsive grid for options --- */}
        {/* This will display 2 columns on mobile and 4 columns on medium screens and larger. */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {optionsContent}
        </div>

        {/* Slot for the "Next" button, which only appears when provided */}
        {nextButtonContent && (
          <div className="mt-8 w-full max-w-md">
            {nextButtonContent}
          </div>
        )}
      </div>
    </GameLayout>
  );
}
