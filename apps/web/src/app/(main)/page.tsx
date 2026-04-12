import type { Metadata } from 'next';
import { HeroSection, KidsGameSelector } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'PowerLetter — Arabic & English Puzzle Games',
  description:
    'A multilingual puzzle and learning platform. Play word games, explore lessons, and follow learning paths in Arabic and English.',
};

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <KidsGameSelector />
    </>
  );
}
