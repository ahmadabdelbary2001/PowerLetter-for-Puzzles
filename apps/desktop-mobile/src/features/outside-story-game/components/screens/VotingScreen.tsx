// src/features/outside-story-game/components/screens/VotingScreen.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const VotingScreen: React.FC<Props> = ({ game }) => {
  const { t, players, submitVote, finishVoting, votingPlayerIndex, nextVoter } = game;
  const [voteCasted, setVoteCasted] = useState(false);

  // --- Determine the current voter ---
  const currentVoter = players[votingPlayerIndex];

  // --- If all players have voted, finish the voting process ---
  // This guard clause prevents the out-of-bounds error.
  if (!currentVoter) {
    finishVoting();
    return <p>{t('loading')}</p>; // Show loading while results are calculated
  }

  // Logic for handling votes and continuing
  const voteOptions = players.filter(p => p.id !== currentVoter.id);

  const handleVote = (votedForId: number) => {
    submitVote(currentVoter.id, votedForId);
    setVoteCasted(true);
  };

  const handleContinue = () => {
    nextVoter();
    setVoteCasted(false);
  };

  // This is the screen shown after a player has voted, before the next player's turn
  if (voteCasted) {
    const nextVoterPlayer = players[votingPlayerIndex + 1];
    const message = nextVoterPlayer
      ? t('passDeviceAndVote', { ns: 'outside_the_story' })?.replace('{player}', nextVoterPlayer.name)
      : t('submitVote', { ns: 'outside_the_story' });

    return (
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">{message}</h2>
        <Button onClick={handleContinue} className="mt-8 w-full">
          {t('next')}
        </Button>
      </div>
    );
  }

  // Main voting screen UI
  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">
        {t('yourTurnToVote', { ns: 'outside_the_story' })?.replace('{player}', currentVoter.name)}
      </h2>
      <div className="flex flex-col gap-3 w-full">
        {voteOptions.map(p => (
          <Button
            key={p.id}
            onClick={() => handleVote(p.id)}
            variant='secondary'
            className="h-16 text-xl"
          >
            {p.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default VotingScreen;
