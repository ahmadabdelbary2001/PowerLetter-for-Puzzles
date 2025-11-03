// src/features/outside-story-game/components/screens/OutsiderGuessScreen.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';

type Props = { game: ReturnType<typeof useOutsideStory> };

const OutsiderGuessScreen: React.FC<Props> = ({ game }) => {
  const { t, currentRound, handleOutsiderGuess, players, setGameState } = game;
  const outsider = players.find(p => p.id === currentRound?.outsiderId);

  if (!currentRound || !outsider) {
    setGameState('results');
    return null;
  }

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{t.outsiderGuessTitle?.replace('{player}', outsider.name) ?? `${outsider.name}, what's the story?`}</h2>
      <div className="grid grid-cols-2 gap-3">
        {currentRound.words.map(word => (
          <Button
            key={word}
            onClick={() => handleOutsiderGuess(word)}
            className="w-full h-16 text-lg"
          >
            {word}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OutsiderGuessScreen;
