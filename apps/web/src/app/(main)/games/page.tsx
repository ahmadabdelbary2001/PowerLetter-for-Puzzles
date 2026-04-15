import type { Metadata } from 'next';
import { GameTypeSelector } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Browse all available puzzle games — from word formation to image clues.',
};

export default function GamesPage() {
  return <GameTypeSelector />;
}
