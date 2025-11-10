// src/features/outside-story-game/components/screens/QuestionIntroScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const QuestionIntroScreen: React.FC<Props> = ({ game }) => {
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

export default QuestionIntroScreen;
