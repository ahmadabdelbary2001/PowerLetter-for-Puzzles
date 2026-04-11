// src/screens/outside-story/components/QuestionIntroScreen.tsx
import React from 'react';
import { Button } from '@/atoms/Button';
import type { useOutsideStory } from '@powerletter/core';

type Props = { game: ReturnType<typeof useOutsideStory> };

export const QuestionIntroScreen: React.FC<Props> = ({ game }) => {
  // --- Destructure the new `setupQuestionTurns` function ---
  const { t, setupQuestionTurns } = game;

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{t('questionTime', { ns: 'outside_the_story' })}</h2>
      <p className="text-xl">
        {t('questionIntroInstruction', { ns: 'outside_the_story' })}
      </p>
      {/* --- This button now calls the function to prepare the question turns --- */}
      <Button onClick={setupQuestionTurns} className="mt-8 w-full">
        {t('next')}
      </Button>
    </div>
  );
};
