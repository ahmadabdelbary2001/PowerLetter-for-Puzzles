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
      <h2 className="text-3xl font-bold mb-4">{t.questionTime ?? 'Question Time'}</h2>
      <p className="text-xl">
        {t.questionIntroInstruction ?? 'Each person will ask another person a question related to the topic. Press next to see who asks who.'}
      </p>
      {/* --- This button now calls the function to prepare the question turns --- */}
      <Button onClick={setupQuestionTurns} className="mt-8 w-full">
        {t.next ?? 'Next'}
      </Button>
    </div>
  );
};

export default QuestionIntroScreen;
