// src/components/organisms/KidsGameModeSelector.tsx
/**
 * KidsGameModeSelector component - A simplified version of GameModeSelector for kids.
 * --- This component now uses the shared GameSelectionLayout to render its UI. ---
 */
import { useState } from 'react';
import { Button } from '../atoms/Button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode, useTranslation, KIDS_CATEGORIES } from "@powerletter/core";
import { ModeSelector } from '../molecules/ModeSelector';
import { CategorySelector } from '../molecules/CategorySelector';
import { useAppRouter, useAppParams } from '../contexts/RouterContext';
import type { GameCategory } from '@powerletter/core';
import { GameSelectionLayout } from '../templates/GameSelectionLayout';

export interface KidsGameModeSelectorProps {
  gameType?: string;
}

export const KidsGameModeSelector: React.FC<KidsGameModeSelectorProps> = ({ gameType: propGameType }) => {
  const { gameMode, setGameMode, setCategories } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const router = useAppRouter();
  const { gameType: paramGameType } = useAppParams<{ gameType: string }>();
  const gameType = propGameType || paramGameType;

  // const metadata = GAME_METADATA.find(g => g.id === gameType);
  // const supported = metadata?.supportedSettings || [];
  // const skipCategoryStep = !supported.includes('category');

  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([]);

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      router.push('/kids-games');
    }
  };

  const handleModeSelect = (mode: 'single' | 'competitive') => {
    setGameMode(mode);
    setStep(2);
  };

  const handleCategoryToggle = (category: GameCategory) => {
    if (category === 'general') {
      setSelectedCategories(['general']);
      return;
    }
    setSelectedCategories(prev => {
      const newSelection = prev.filter(c => c !== 'general');
      return newSelection.includes(category)
        ? newSelection.filter(c => c !== category)
        : [...newSelection, category];
    });
  };

  const handleContinueFromCategories = () => {
    setCategories(selectedCategories);
    if (gameMode === 'competitive') {
      router.push(`/team-config/${gameType}`);
    } else {
      router.push(`/game/${gameType}`);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ModeSelector onSelect={handleModeSelect} />;
      case 2:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t('selectCategory', { ns: 'selection' })}</h2>
            <p className="text-center text-muted-foreground mb-6">{t('selectCategoryHint', { ns: 'selection' })}</p>
            <CategorySelector
              // --- Create a mutable copy of the readonly array ---
              categories={[...KIDS_CATEGORIES]}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              className="gap-4 sm:gap-6"
            />
            <div className="flex justify-center mt-8">
              <Button onClick={handleContinueFromCategories} disabled={selectedCategories.length === 0}>
                {t('continue')} {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <GameSelectionLayout
      currentStep={step}
      totalSteps={2}
      onBack={handleBack}
      headerView="kids"
      backgroundClass="bg-linear-to-br from-green-50 via-background to-yellow-50 dark:from-gray-900 dark:to-gray-800"
    >
      {renderStepContent()}
    </GameSelectionLayout>
  );
};
