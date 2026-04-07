// src/screens/outside-story/components/RoundEndScreen.tsx
import React from 'react';
import { Button } from '../../../atoms/Button';
import { useAppRouter } from '../../../contexts/RouterContext';
import type { useOutsideStory } from '@powerletter/core';

type Props = { game: ReturnType<typeof useOutsideStory> };

export const RoundEndScreen: React.FC<Props> = ({ game }) => {
  const { t, playAgain, changePlayersAndReset } = game;
  const router = useAppRouter();

  const handleChangePlayers = () => {
    changePlayersAndReset();
    // Navigate to the global team configurator page
    router.push('/settings/teams/outside-the-story');
  };

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{t('roundEndTitle', { ns: 'outside_the_story' })}</h2>
      <p className="text-xl mb-8">
        {t('roundEndInstruction', { ns: 'outside_the_story' })}
      </p>
      <div className="flex flex-col gap-4">
        <Button onClick={playAgain} className="w-full">
          {t('continuePlay', { ns: 'outside_the_story' })}
        </Button>
        <Button onClick={handleChangePlayers} variant="secondary" className="w-full">
          {t('changePlayers', { ns: 'outside_the_story' })}
        </Button>
      </div>
    </div>
  );
};
