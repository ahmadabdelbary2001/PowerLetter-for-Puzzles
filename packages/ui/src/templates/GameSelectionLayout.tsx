// src/components/templates/GameSelectionLayout.tsx
/**
 * @description A reusable layout for the multi-step game selection process.
 * Shared and synchronized version. The Header is now provided by the global shell.
 */
"use client";

import React from 'react';
import { Button } from '@ui/atoms/Button';
import { Card } from '@ui/atoms/Card';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { StepIndicator } from '@ui/atoms/StepIndicator';
import { useTranslation } from "@powerletter/core";

interface GameSelectionLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  headerView?: 'kids' | 'selection'; // Kept for compatibility but unused
  backgroundClass?: string;
}

export const GameSelectionLayout: React.FC<GameSelectionLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  onBack,
  backgroundClass = 'bg-linear-to-br from-background via-background to-muted/20',
}) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <main className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        <Card className="p-6 sm:p-10 bg-card/80 backdrop-blur-sm">
          {children}
        </Card>
        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t('back')}
          </Button>
        </div>
      </main>
    </div>
  );
};
