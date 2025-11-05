// src/components/templates/MultipleChoiceLayout.tsx
/**
 * @description A reusable layout template for multiple-choice style games.
 * This template standardizes the page structure for games that present a prompt
 * and a set of selectable options. It includes slots for the prompt, the options,
 * and a next button, along with a notification area.
 */
import React from 'react';
// --- Import the GameLayout component itself, not a separate props type ---
import { GameLayout } from '@/components/templates/GameLayout';
import { Notification } from '@/components/atoms/Notification';

/**
 * @interface MultipleChoiceLayoutProps
 * @description Props for the MultipleChoiceLayout component.
 * It extends the base GameLayoutProps and adds slots for game-specific content.
 */
// --- Use React.ComponentProps to correctly infer the props from GameLayout ---
interface MultipleChoiceLayoutProps extends Omit<React.ComponentProps<typeof GameLayout>, 'children'> {
  notificationMessage: string | null;
  notificationType?: 'success' | 'error' | 'warning' | 'info';
  promptContent: React.ReactNode;
  optionsContent: React.ReactNode;
  nextButtonContent?: React.ReactNode;
}

export const MultipleChoiceLayout: React.FC<MultipleChoiceLayoutProps> = ({
  notificationMessage,
  notificationType = 'info',
  promptContent,
  optionsContent,
  nextButtonContent,
  // --- Use the rest operator to gather all other props for GameLayout ---
  ...gameLayoutProps
}) => {
  return (
    // --- Spread the gathered props onto the GameLayout component ---
    // This ensures `title`, `levelIndex`, `onBack`, etc., are all passed correctly.
    // Also, explicitly set layoutType as it's part of this template's design.
    <GameLayout {...gameLayoutProps} layoutType="image">
      {/* Slot for the notification */}
      {notificationMessage && (
        <Notification message={notificationMessage} type={notificationType} duration={1000} />
      )}

      {/* Slot for the main game prompt (e.g., a word or an image) */}
      {promptContent}

      {/* Slot for the grid of selectable options */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {optionsContent}
      </div>

      {/* Slot for the "Next" button, which only appears when provided */}
      {nextButtonContent && (
        <div className="pt-4">
          {nextButtonContent}
        </div>
      )}
    </GameLayout>
  );
};
