// src/features/outside-story-game/components/screens/ResultsScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const ResultsScreen: React.FC<Props> = ({ game }) => {
  const { t, currentRound, players, setGameState } = game;

  if (!currentRound || !currentRound.roundResult) {
    return (
      <div className="text-center">
        <p>{t.loadingResults ?? 'Loading results...'}</p>
        {/* --- Go to round_end, not a non-existent state --- */}
        <Button onClick={() => setGameState('round_end')} className="mt-4">{t.continue ?? 'Continue'}</Button>
      </div>
    );
  }

  const { votedPlayerId, outsiderGuessedCorrectly } = currentRound.roundResult;
  const outsider = players.find(p => p.id === currentRound.outsiderId);
  let outcomeMessage = '';
  if (votedPlayerId === currentRound.outsiderId) {
    if (outsiderGuessedCorrectly) {
      outcomeMessage = t.outsiderCaughtButGuessed?.replace('{secret}', currentRound.secret) ?? `You were caught! But you guessed the story (${currentRound.secret}), well done!`;
    } else {
      outcomeMessage = t.insidersWin?.replace('{secret}', currentRound.secret) ?? `The Insiders win! The story was (${currentRound.secret}).`;
    }
  } else {
    outcomeMessage = t.outsiderWins?.replace('{player}', outsider?.name ?? '') ?? `${outsider?.name} fooled you all! They were the Outsider.`;
  }

  // Main results screen UI
  return (
    <div className="text-center max-w-md">
      <h2 className="text-4xl font-bold mb-6">{t.results ?? 'Results'}</h2>
      
      <div className="space-y-2 my-4 w-full text-2xl">
        {players.map(p => (
          <div key={p.id} className="flex items-center justify-between">
            <span>{p.name}</span>
            <span>{p.score}</span>
          </div>
        ))}
      </div>

      <p className="text-xl my-6">{outcomeMessage}</p>

      {/* --- Go to round_end on next --- */}
      <Button onClick={() => setGameState('round_end')} className="mt-8 w-full">
        {t.next ?? 'Next'}
      </Button>
    </div>
  );
};

export default ResultsScreen;
