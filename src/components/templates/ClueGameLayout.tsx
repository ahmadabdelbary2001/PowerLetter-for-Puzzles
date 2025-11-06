// src/components/templates/ClueGameLayout.tsx
/**
 * @description A reusable layout template for word puzzle games.
 * This component provides a standardized structure for games that involve
 * a prompt, a solution area, letter options, and controls. It uses slots
 * to allow different games to plug in their specific content.
 */
import React from 'react';
import { GameLayout } from './GameLayout';
import { Notification as NotificationComponent } from '@/components/atoms/Notification';

type Notification = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
};

type Instructions = {
  title: string;
  description: string;
  steps: string[];
};

/**
 * @interface ClueGameLayoutProps
 * @description Props for the ClueGameLayout component.
 */
interface ClueGameLayoutProps {
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  instructions?: Instructions;
  notification: Notification | null;
  // --- Added layoutType to the props ---
  // This allows child components to specify the container size.
  layoutType?: 'text' | 'image';
  promptContent: React.ReactNode;
  solutionContent: React.ReactNode;
  letterOptionsContent: React.ReactNode;
  gameControlsContent: React.ReactNode;
  wrongAnswersContent?: React.ReactNode;
}

export const ClueGameLayout: React.FC<ClueGameLayoutProps> = ({
  title,
  levelIndex,
  onBack,
  difficulty,
  instructions,
  notification,
  // --- Destructure layoutType ---
  layoutType,
  promptContent,
  solutionContent,
  letterOptionsContent,
  gameControlsContent,
  wrongAnswersContent,
}) => {
  // Determine notification message and type
  const notifMessage = notification?.message ?? null;
  const notifType = notification?.type ?? "info";

  return (
    <GameLayout
      title={title}
      levelIndex={levelIndex}
      onBack={onBack}
      difficulty={difficulty}
      instructions={instructions}
      // --- Pass the layoutType prop down to GameLayout ---
      // This will apply the correct max-width to the container.
      layoutType={layoutType}
    >
      {/* Display notification if there is one */}
      {notifMessage && <NotificationComponent message={notifMessage} type={notifType} />}
      
      {/* Slots for game content */}
      {promptContent}
      {solutionContent}
      {letterOptionsContent}
      {wrongAnswersContent}
      {gameControlsContent}
    </GameLayout>
  );
};
