import type { Metadata } from 'next';
import { Header, Footer } from '@powerletter/ui';

export const metadata: Metadata = {
  title: {
    template: '%s | PowerLetter',
    default: 'PowerLetter for Puzzles',
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
