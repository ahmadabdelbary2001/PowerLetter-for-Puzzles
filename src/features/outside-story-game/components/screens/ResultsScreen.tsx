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
        <p>{t('loadingResults', { ns: 'outside_the_story' })}</p>
        {/* --- Go to round_end, not a non-existent state --- */}
        <Button onClick={() => setGameState('round_end')} className="mt-4">{t('continue')}</Button>
      </div>
    );
  }

  const { votedPlayerId, outsiderGuessedCorrectly } = currentRound.roundResult;
  const outsider = players.find(p => p.id === currentRound.outsiderId);
  let outcomeMessage = '';
  if (votedPlayerId === currentRound.outsiderId) {
    if (outsiderGuessedCorrectly) {
      outcomeMessage = t('outsiderCaughtButGuessed', { ns: 'outside_the_story' })?.replace('{secret}', currentRound.secret);
    } else {
      outcomeMessage = t('insidersWin', { ns: 'outside_the_story' })?.replace('{secret}', currentRound.secret);
    }
  } else {
    outcomeMessage = t('outsiderWins', { ns: 'outside_the_story' })?.replace('{player}', outsider?.name ?? '');
  }

  // Main results screen UI
  return (
    <div className="text-center max-w-md">
      <h2 className="text-4xl font-bold mb-6">{t('results', { ns: 'outside_the_story' })}</h2>
      
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
        {t('next')}
      </Button>
    </div>
  );
};

export default ResultsScreen;
