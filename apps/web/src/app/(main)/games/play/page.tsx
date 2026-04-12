import type { Metadata } from 'next';
import { GameScreen } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'Play',
  description: 'Play your selected puzzle game.',
};

export default function GamePlayPage() {
  return (
    <div className="relative min-h-screen">
      {/* GameScreen is a full-bleed organism that handles its own layout */}
      <GameScreen />
    </div>
  );
}
