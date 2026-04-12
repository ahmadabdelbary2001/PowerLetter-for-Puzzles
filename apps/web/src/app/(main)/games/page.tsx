import type { Metadata } from 'next';
import { GameModeSelector } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Browse all available puzzle games — from word formation to image clues.',
};

export default function GamesPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Games</h1>
      <GameModeSelector />
    </section>
  );
}
