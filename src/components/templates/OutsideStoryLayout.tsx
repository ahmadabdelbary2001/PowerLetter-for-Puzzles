// src/components/templates/OutsideStoryLayout.tsx
/**
 * @description A reusable layout template specifically for the "Outside the Story" game.
 * This component standardizes the page structure, including the main GameLayout
 * and the characteristic blue container for the game's content.
 */
import React from 'react';
import { GameLayout } from '@/components/templates/GameLayout';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * @interface OutsideStoryLayoutProps
 * @description Props for the OutsideStoryLayout component.
 */
interface OutsideStoryLayoutProps {
  children: React.ReactNode;
  onBack: () => void;
}

export const OutsideStoryLayout: React.FC<OutsideStoryLayoutProps> = ({ children, onBack }) => {
  const { t } = useTranslation();

  return (
    <GameLayout
      title={t.outsideTheStoryTitle ?? 'Outside the Story'}
      onBack={onBack}
      layoutType="text"
      levelIndex={0} // This game doesn't have traditional levels, so we use 0.
    >
      {/* This is the characteristic blue container for the game's content. */}
      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-blue-500 text-white rounded-lg min-h-[50vh]">
        {children}
      </div>
    </GameLayout>
  );
};
