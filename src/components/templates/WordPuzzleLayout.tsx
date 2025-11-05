// src/components/templates/WordPuzzleLayout.tsx
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

// --- Defined a specific type for the instructions object ---
// This ensures type safety and matches what the GameLayout component expects.
type Instructions = {
  title: string;
  description: string;
  steps: string[];
};

/**
 * @interface WordPuzzleLayoutProps
 * @description Props for the WordPuzzleLayout component.
 */
interface WordPuzzleLayoutProps {
  title: string;
  levelIndex: number;
  onBack: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  instructions?: Instructions; // Use the specific Instructions type
  notification: Notification | null;
  promptContent: React.ReactNode;
  solutionContent: React.ReactNode;
  letterOptionsContent: React.ReactNode;
  gameControlsContent: React.ReactNode;
  wrongAnswersContent?: React.ReactNode;
}

export const WordPuzzleLayout: React.FC<WordPuzzleLayoutProps> = ({
  title,
  levelIndex,
  onBack,
  difficulty,
  instructions,
  notification,
  promptContent,
  solutionContent,
  letterOptionsContent,
  gameControlsContent,
  wrongAnswersContent,
}) => {
  // Determine notification message and type from the notification object
  const notifMessage = notification?.message ?? null;
  const notifType = notification?.type ?? "info";

  return (
    <GameLayout
      title={title}
      levelIndex={levelIndex}
      onBack={onBack}
      difficulty={difficulty}
      instructions={instructions}
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
