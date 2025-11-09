// src/components/templates/GameSelectionLayout.tsx
/**
 * @description A reusable layout for the multi-step game selection process.
 * It provides the overall page structure, including the header, step indicator,
 * card, and back button, while allowing specific content for each step to be
 * passed in as children.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/organisms/Header';
import { StepIndicator } from '@/components/atoms/StepIndicator';
import { useTranslation } from "@/hooks/useTranslation";

interface GameSelectionLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  headerView: 'kids' | 'selection';
  backgroundClass?: string;
}

export const GameSelectionLayout: React.FC<GameSelectionLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  headerView,
  backgroundClass = 'bg-gradient-to-br from-background via-background to-muted/20',
}) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <Header currentView={headerView} />
      <main className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <Card className="p-6 sm:p-10 bg-card/80 backdrop-blur-sm">
          {children}
        </Card>
        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t.back}
          </Button>
        </div>
      </main>
    </div>
  );
};
