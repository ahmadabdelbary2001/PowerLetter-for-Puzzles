import type { Metadata } from 'next';
import { KidsGameSelector } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'Kids Puzzles',
  description: 'Fun and educational word puzzles designed specifically for children.',
};

export default function KidsGamesPage() {
  return <KidsGameSelector />;
}
