// src/components/templates/OutsideStoryLayout.tsx
/**
 * @description A reusable layout template specifically for the "Outside the Story" game.
 * This component standardizes the page structure, including the main GameLayout
 * and the characteristic blue container for the game's content.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import type { NotificationData } from '@/components/atoms/Notification';

/**
 * @interface OutsideStoryLayoutProps
 * @description Props for the OutsideStoryLayout component.
 */
interface OutsideStoryLayoutProps {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
  notification: NotificationData | null;
  onClearNotification: () => void;
  instructions?: {
    title: string;
    description: string;
    steps: string[];
  };
}

export const OutsideStoryLayout: React.FC<OutsideStoryLayoutProps> = ({ 
  children,
  // --- Gather all remaining props to pass to GameLayout ---
  ...gameLayoutProps
}) => {
  return (
    // --- Spread all props, including notification props, to GameLayout ---
    <GameLayout
      {...gameLayoutProps}
      layoutType="text"
      levelIndex={0} // This game doesn't have traditional levels
    >
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-500 text-white rounded-lg min-h-[50vh]">
        {children}
      </div>
    </GameLayout>
  );
};
