// src/components/organisms/KidsGameModeSelector.tsx
/**
 * KidsGameModeSelector component - A simplified version of GameModeSelector for kids
 * Features colorful UI, kid-friendly categories, and a simpler 2-step process
 * Allows selection of game mode and categories appropriate for children
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, PawPrint, Apple, Shapes, BrainCircuit } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import { StepIndicator } from '@/components/atoms/StepIndicator';
import { ModeSelector } from '@/components/molecules/ModeSelector';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import { useNavigate, useParams } from 'react-router-dom';
import type { GameCategory } from '@/types/game';

// Kid-friendly categories with colorful icons and translation keys
const categoriesData = [
  { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
  { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
  { id: 'fruits', icon: <Apple size={48} />, labelKey: 'fruits' },
  { id: 'shapes', icon: <Shapes size={48} />, labelKey: 'shapes' },
] as const;

// --- Main Component ---
const KidsGameModeSelector: React.FC = () => {
  // Custom hooks for game state and translation
  const { setGameMode, setCategories } = useGameMode();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  // State for current step and selected categories
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([]);

  // Handle back navigation - either to previous step or to kids games page
  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      // Navigate back to kids games selection screen when on first step
      navigate('/kids-games');
    }
  };

  // Handle game mode selection and advance to category selection
  const handleModeSelect = (mode: 'single' | 'competitive') => {
    setGameMode(mode);
    setStep(2);
  };

  // Handle category selection with special logic for 'general' category
  const handleCategoryToggle = (category: GameCategory) => {
    if (category === 'general') {
      setSelectedCategories(['general']);
      return;
    }
    setSelectedCategories(prev => {
      const newSelection = prev.filter(c => c !== 'general');
      if (newSelection.includes(category)) {
        return newSelection.filter(c => c !== category);
      } else {
        return [...newSelection, category];
      }
    });
  };

  // Finalize selections and navigate to appropriate game screen
  const handleContinueFromCategories = () => {
    setCategories(selectedCategories);
    const { gameMode } = useGameMode.getState();
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate(`/game/${gameType}`);
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1: // Select Mode
        return <ModeSelector onSelect={handleModeSelect} />;
      case 2: // Select Category
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t.selectCategory}</h2>
            <p className="text-center text-muted-foreground mb-6">{t.selectCategoryDesc}</p>
            <CategorySelector
              categories={[...categoriesData]}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
              className="gap-4 sm:gap-6"
            />
            <div className="flex justify-center mt-8">
              <Button onClick={handleContinueFromCategories} disabled={selectedCategories.length === 0}>
                {t.continue} {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentView="kids" />
      <main className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
        {/* Step indicator showing progress through the simplified 2-step process */}
        <StepIndicator currentStep={step} totalSteps={2} />
        <Card className="p-6 sm:p-10 bg-card/80 backdrop-blur-sm">
          {renderStepContent()}
        </Card>
        {/* Back navigation button */}
        <div className="mt-8 flex justify-start">
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {t.back}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default KidsGameModeSelector;