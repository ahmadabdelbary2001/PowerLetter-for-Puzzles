// src\components\organisms\GameModeSelector.tsx
/**
 * GameModeSelector component - A multi-step wizard for configuring game settings
 * Allows users to select game mode, categories, and difficulty level
 * Features a step-by-step UI with navigation controls
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, PawPrint, FlaskConical, Globe, BrainCircuit } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/organisms/Header';
import { StepIndicator } from '@/components/atoms/StepIndicator';
import { ModeSelector } from '@/components/molecules/ModeSelector';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import { DifficultySelector } from '@/components/molecules/DifficultySelector';
import { useNavigate, useParams } from 'react-router-dom';
import type { GameCategory, Difficulty } from '@/types/game';

// Available game categories with icons and translation keys
const categoriesData = [
  { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
  { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
  { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
  { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
] as const;

// Available difficulty levels with labels and color indicators
const difficulties = [
  { id: 'easy', labelKey: 'easy', color: 'bg-green-500' },
  { id: 'medium', labelKey: 'medium', color: 'bg-yellow-500' },
  { id: 'hard', labelKey: 'hard', color: 'bg-red-500' },
] as const;

const GameModeSelector: React.FC = () => {
  // Custom hooks for game state and translation
  const { setGameMode, categories: selectedCategories, setCategories, setDifficulty } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  // Current step in the selection process (1-3)
  const [step, setStep] = useState(1);

  // Handle back navigation - either to previous step or to games page
  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      navigate('/games');
    }
  };

  // Handle game mode selection and advance to next step
  const handleModeSelect = (mode: 'single' | 'competitive') => {
    setGameMode(mode);
    setStep(2);
  };

  // Handle category selection with special logic for 'general' category
  const handleCategoryToggle = (category: GameCategory) => {
    if (category === 'general') {
      setCategories(['general']);
      return;
    }

    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category && c !== 'general')
      : [...selectedCategories.filter(c => c !== 'general'), category];

    if (newSelection.length === 0) {
      setCategories(['general']); // Default to general if nothing is selected
    } else {
      setCategories(newSelection);
    }
  };

  // Proceed to difficulty selection if at least one category is selected
  const handleContinueFromCategories = () => {
    if (selectedCategories.length > 0) {
      setStep(3);
    }
  };

  // Handle difficulty selection and navigate to appropriate game screen
  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
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
      case 1:
        return <ModeSelector onSelect={handleModeSelect} />;
      case 2:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t.selectCategory}</h2>
            <p className="text-center text-muted-foreground mb-6">{t.selectCategoryDesc}</p>
            <CategorySelector
              categories={[...categoriesData]}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            <div className="flex justify-center mt-8">
              <Button onClick={handleContinueFromCategories} disabled={selectedCategories.length === 0}>
                {t.continue} {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t.selectDifficulty}</h2>
            <DifficultySelector
              difficulties={[...difficulties]}
              onDifficultySelect={handleDifficultySelect}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="selection" />
      <main className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
        {/* Step indicator showing progress through the selection process */}
        <StepIndicator currentStep={step} totalSteps={3} />
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

export default GameModeSelector;