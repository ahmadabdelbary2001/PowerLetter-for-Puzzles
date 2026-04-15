"use client";

// src/screens/outside-story/components/ResultsScreen.tsx
import React from 'react';
import { Button } from '@ui/atoms/Button';
import type { useOutsideStory, Team } from '@powerletter/core';

type Props = { game: ReturnType<typeof useOutsideStory> };

export const ResultsScreen: React.FC<Props> = ({ game }) => {
  const { t, currentRound, players, setGameState } = game;

  if (!currentRound || !currentRound.roundResult) {
    return (
      <div className="text-center">
        <p>{t('loadingResults', { ns: 'outside_the_story' })}</p>
        <Button onClick={() => setGameState('round_end')} className="mt-4">{t('continue')}</Button>
      </div>
    );
  }

  const { votedPlayerId, outsiderGuessedCorrectly, pointsAwarded } = currentRound.roundResult;
  const outsider = players.find((p: Team) => p.id === currentRound.outsiderId);
  const isOutsiderCaught = votedPlayerId === currentRound.outsiderId;
  const insidersWin = isOutsiderCaught && !outsiderGuessedCorrectly;
  
  let outcomeTitle = '';
  let outcomeMessage = '';
  
  if (insidersWin) {
    outcomeTitle = t('insidersWinTitle', { ns: 'outside_the_story' }) || 'محققون فازوا!';
    outcomeMessage = t('insidersWin', { ns: 'outside_the_story' })?.replace('{secret}', currentRound.secret);
  } else if (isOutsiderCaught && outsiderGuessedCorrectly) {
    outcomeTitle = t('outsiderWinsTitle', { ns: 'outside_the_story' }) || 'الغريب فاز!';
    outcomeMessage = t('outsiderCaughtButGuessed', { ns: 'outside_the_story' })?.replace('{secret}', currentRound.secret);
  } else {
    outcomeTitle = t('outsiderWinsTitle', { ns: 'outside_the_story' }) || 'الغريب فاز!';
    outcomeMessage = t('outsiderWins', { ns: 'outside_the_story' })?.replace('{player}', outsider?.name ?? '');
  }

  // Main results screen UI
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4">
      <div className={`w-full p-6 text-center rounded-2xl mb-8 border-2 ${insidersWin ? 'bg-success/10 border-success' : 'bg-primary/10 border-primary'}`}>
        <h2 className="text-4xl font-black mb-2 uppercase tracking-tight italic">
          {outcomeTitle}
        </h2>
        <p className="text-xl opacity-90">{outcomeMessage}</p>
      </div>
      
      <div className="w-full space-y-3 mb-8">
        <h3 className="text-sm font-bold uppercase tracking-widest opacity-60 px-2">
          {t('scoreTable', { ns: 'outside_the_story' }) || 'نتائج الجولة'}
        </h3>
        {players.map((p: Team) => (
          <div 
            key={p.id} 
            className={`flex items-center justify-between p-4 rounded-xl bg-card border border-border shadow-sm ${p.id === currentRound.outsiderId ? 'ring-2 ring-primary/30' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                {p.name.charAt(0)}
              </div>
              <span className="font-bold text-lg">{p.name} {p.id === currentRound.outsiderId && '(🕵️)'}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{p.score}</div>
              {pointsAwarded && pointsAwarded[p.id] > 0 && (
                <div className="text-xs font-bold text-success">+{pointsAwarded[p.id]}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button 
        onClick={() => setGameState('round_end')} 
        size="lg"
        className="w-full h-16 text-xl rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
      >
        {t('next')}
      </Button>
    </div>
  );
};
