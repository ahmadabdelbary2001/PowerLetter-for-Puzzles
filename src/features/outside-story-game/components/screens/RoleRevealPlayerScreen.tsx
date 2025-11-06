// src/features/outside-story-game/components/screens/RoleRevealPlayerScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const RoleRevealPlayerScreen: React.FC<Props> = ({ game }) => {
  const { t, players, currentRound, currentPlayerTurn, nextTurn, setGameState } = game;
  const player = players[currentPlayerTurn];
  const isOutsider = player.id === currentRound?.outsiderId;

  const handleContinue = () => {
    nextTurn(); // Increment the turn counter
    setGameState('role_reveal_handoff'); // Go back to the handoff screen for the next player
  };

  // --- Get the category name from the current round ---
  // We also get the translated version of the category name.
  const categoryName = currentRound?.category ?? '';
  const translatedCategory = t[categoryName as keyof typeof t] ?? categoryName;

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{player.name}</h2>
      {isOutsider ? (
        <p className="text-xl">
          {/* --- Pass the category to the translation function --- */}
          {t.youAreTheOutsider?.replace('{category}', translatedCategory) ?? 'You are the Outsider! Try to figure out the story.'}
        </p>
      ) : (
        <p className="text-xl">
          {t.youAreAnInsider?.replace('{secret}', currentRound?.secret ?? '') ?? `You are an Insider! The story is **${currentRound?.secret}**. Your goal is to find out who among you is the Outsider.`}
        </p>
      )}
      <Button onClick={handleContinue} className="mt-8 w-full">
        {t.next ?? 'Next'}
      </Button>
    </div>
  );
};

export default RoleRevealPlayerScreen;
