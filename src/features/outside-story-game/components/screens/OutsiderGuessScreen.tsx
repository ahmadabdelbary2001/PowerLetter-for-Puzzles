// src/features/outside-story-game/components/screens/OutsiderGuessScreen.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { useOutsideStory } from '../../hooks/useOutsideStory';
import { cn } from '@/lib/utils'; // Import cn for conditional classes

type Props = { game: ReturnType<typeof useOutsideStory> };

const OutsiderGuessScreen: React.FC<Props> = ({ game }) => {
  const { t, currentRound, handleOutsiderGuess, players, setGameState } = game;

  // --- State to manage the visual feedback for the guess ---
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [guessStatus, setGuessStatus] = useState<'correct' | 'incorrect' | null>(null);

  const outsider = players.find(p => p.id === currentRound?.outsiderId);

  if (!currentRound || !outsider) {
    setGameState('results');
    return null;
  }

  /**
   * @function onGuess
   * @description Handles the Outsider's guess. It first sets the local state
   * to show visual feedback on the button, then calls the main game logic
   * after a short delay.
   */
  const onGuess = (word: string) => {
    // Don't allow another guess while one is being processed
    if (selectedGuess) return;

    setSelectedGuess(word);
    const isCorrect = word === currentRound.secret;
    setGuessStatus(isCorrect ? 'correct' : 'incorrect');

    // Proceed to the results screen after a delay
    setTimeout(() => {
      handleOutsiderGuess(word);
    }, 1500); // 1.5 second delay to show the effect
  };

  return (
    <div className="text-center max-w-md">
      <h2 className="text-3xl font-bold mb-4">{t('outsiderGuessTitle', { ns: 'outside_the_story' })?.replace('{player}', outsider.name)}</h2>
      <div className="grid grid-cols-2 gap-3">
        {currentRound.words.map(word => {
          const isSelected = selectedGuess === word;
          const isCorrect = guessStatus === 'correct';
          const isIncorrect = guessStatus === 'incorrect';

          return (
            <Button
              key={word}
              // --- Call the local onGuess function ---
              onClick={() => onGuess(word)}
              // --- Disable all buttons after a guess is made ---
              disabled={!!selectedGuess}
              className={cn(
                "w-full h-16 text-lg transition-all duration-300",
                // --- Apply styles based on the guess status ---
                isSelected && isCorrect && "bg-green-500 hover:bg-green-600 ring-4 ring-white",
                isSelected && isIncorrect && "bg-red-500 hover:bg-red-600 ring-4 ring-white",
                !isSelected && selectedGuess && "opacity-50" // Fade out non-selected buttons
              )}
            >
              {word}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default OutsiderGuessScreen;
