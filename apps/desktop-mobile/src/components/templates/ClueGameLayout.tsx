// src/components/templates/ClueGameLayout.tsx
/**
 * @description A reusable layout template for word puzzle games.
 * This component provides a standardized structure for games that involve
 * a prompt, a solution area, letter options, and controls. It uses slots
 * to allow different games to plug in their specific content.
 */
import React from 'react';
import { GameLayout } from './GameLayout';
import type { NotificationData } from '@/components/atoms/Notification';

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
  notification: NotificationData | null;
  onClearNotification: () => void;
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
  promptContent,
  solutionContent,
  letterOptionsContent,
  gameControlsContent,
  wrongAnswersContent,
  // --- Gather all remaining props to pass to GameLayout ---
  ...gameLayoutProps
}) => {
  return (
    // --- Spread all props, including notification props, to GameLayout ---
    <GameLayout {...gameLayoutProps}>
      {/* Slots for game content */}
      {promptContent}
      {solutionContent}
      {letterOptionsContent}
      {wrongAnswersContent}
      {gameControlsContent}
    </GameLayout>
  );
};