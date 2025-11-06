// src/features/outside-story-game/components/screens/QuestionTurnScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const QuestionTurnScreen: React.FC<Props> = ({ game }) => {
  // --- Get the pre-calculated pairs from the hook ---
  const { t, currentPlayerTurn, setGameState, nextTurn, questionPairs } = game;

  // --- Guard clause to prevent rendering before pairs are ready ---
  if (!questionPairs || questionPairs.length === 0 || currentPlayerTurn >= questionPairs.length) {
    return <p>{t.loading ?? 'Loading...'}</p>;
  }

  // --- Get the current pair from the stable array ---
  const currentPair = questionPairs[currentPlayerTurn];
  const { asker, askee } = currentPair;

  // Logic to handle the next turn or move to voting
  const handleNext = () => {
    if (currentPlayerTurn >= questionPairs.length - 1) {
      setGameState('voting');
    } else {
      nextTurn();
    }
  };

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{t.questionTime ?? 'Question Time'}</h2>
      <p className="text-xl">
        {/* This message will now appear correctly for all players */}
        {t.askerToAskeeInstruction
          ?.replace('{asker}', asker.name)
          .replace('{askee}', askee.name) 
          ?? `${asker.name}, ask ${askee.name} a question about the topic! Choose your question carefully so the Outsider doesn't figure it out.`}
      </p>
      <Button onClick={handleNext} className="mt-8 w-full">
        {t.next ?? 'Next'}
      </Button>
    </div>
  );
};

export default QuestionTurnScreen;
