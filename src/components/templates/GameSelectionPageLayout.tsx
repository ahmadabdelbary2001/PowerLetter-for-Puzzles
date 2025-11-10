// src/components/templates/GameSelectionPageLayout.tsx
/**
 * Purpose: A reusable layout template for game selection pages.
 *
 * @description 
 * This component provides the standard page structure, including the header, footer,
 * and a main content area with a title and description. It accepts the page-specific
 * title, description, and game cards as children, promoting code reuse.
 * The grid gap has been reduced for a more compact layout.
 */
import React from 'react';
import { Header } from '@/components/organisms/Header';
import Footer from '@/components/organisms/Footer';
import { useTranslation } from '@/hooks/useTranslation';

interface GameSelectionPageLayoutProps {
  pageTitle: React.ReactNode;
  pageDescription: string;
  children: React.ReactNode;
  backgroundClass: string;
  headerView: 'selection' | 'kids';
}

export const GameSelectionPageLayout: React.FC<GameSelectionPageLayoutProps> = ({
  pageTitle,
  pageDescription,
  children,
  backgroundClass,
  headerView,
}) => {
  const { i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <Header currentView={headerView} />
      <main className="min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto px-4 py-6 max-w-6xl" dir={dir}>
          {/* Page Header */}
          <div className="text-center mb-6 md:mb-8">
            {pageTitle}
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              {pageDescription}
            </p>
          </div>

          {/* Game Cards Grid with reduced gap */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
