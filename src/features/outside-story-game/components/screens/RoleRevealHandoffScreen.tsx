// src/features/outside-story-game/components/screens/RoleRevealHandoffScreen.tsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const RoleRevealHandoffScreen: React.FC<Props> = ({ game }) => {
  const { t, players, currentPlayerTurn, setGameState } = game;

  // Use useEffect to handle state transitions after rendering.
  useEffect(() => {
    // If the turn counter has gone past the last player, it's time to start the questions.
    if (currentPlayerTurn >= players.length) {
      setGameState('question_intro');
    }
  }, [currentPlayerTurn, players.length, setGameState]);

  // If we are past the last player, render nothing while useEffect transitions.
  if (currentPlayerTurn >= players.length) {
    return null;
  }

  const player = players[currentPlayerTurn];

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{player.name}</h2>
      <p className="text-xl">
        {t.givePhoneToPlayer?.replace('{player}', player.name) ?? `Give the phone to ${player.name}`}
      </p>
      <p className="text-xl mt-2">
        {t.pressNextToSeeRole ?? 'Press next to see if you are in or out of the story. Don\'t let anyone else see the screen!'}
      </p>
      <Button onClick={() => setGameState('role_reveal_player')} className="mt-8 w-full">
        {t.next ?? 'Next'}
      </Button>
    </div>
  );
};

export default RoleRevealHandoffScreen;
