// src/features/outside-story-game/components/screens/VotingScreen.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const VotingScreen: React.FC<Props> = ({ game }) => {
  const { t, players, submitVote, finishVoting, votingPlayerIndex, nextVoter } = game;
  const [voteCasted, setVoteCasted] = useState(false);

  // Determine the current player who is voting
  const currentVoter = players[votingPlayerIndex];

  // If all players have voted, finish the voting process
  if (!currentVoter) {
    finishVoting();
    return <p>{t.loading ?? 'Loading...'}</p>; // Show loading while results are calculated
  }

  // Players that can be voted for (everyone except the current voter)
  const voteOptions = players.filter(p => p.id !== currentVoter.id);

  const handleVote = (votedForId: number) => {
    submitVote(currentVoter.id, votedForId);
    setVoteCasted(true); // Show the "pass device" message
  };

  const handleContinue = () => {
    nextVoter(); // Move to the next player
    setVoteCasted(false); // Reset for the next voter
  };

  // This is the screen shown after a player has voted, before the next player's turn
  if (voteCasted) {
    const nextVoterPlayer = players[votingPlayerIndex + 1];
    const message = nextVoterPlayer
      ? t.passDeviceAndVote?.replace('{player}', nextVoterPlayer.name) ?? `Pass the device to ${nextVoterPlayer.name} to vote.`
      : t.submitVote ?? 'Submit Vote';

    return (
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4">{message}</h2>
        <Button onClick={handleContinue} className="mt-8 w-full">
          {t.next ?? 'Next'}
        </Button>
      </div>
    );
  }

  // This is the main voting screen for the current player
  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">
        {t.yourTurnToVote?.replace('{player}', currentVoter.name) ?? `${currentVoter.name}, it's your turn to vote.`}
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
