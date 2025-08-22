// src\components\organisms\GameModeSelector.tsx
/**
 * @description A multi-step wizard for configuring game settings.
 * Allows users to select game mode, categories, and difficulty level.
 * Features a step-by-step UI with navigation controls.
 */
import React, { useState, useEffect } from 'react';
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

const categoriesData = [
    { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
] as const;

const difficulties = [
    { id: 'easy', labelKey: 'easy', color: 'bg-green-500' },
    { id: 'medium', labelKey: 'medium', color: 'bg-yellow-500' },
    { id: 'hard', labelKey: 'hard', color: 'bg-red-500' },
] as const;


const GameModeSelector: React.FC = () => {
  const { setGameMode, categories: selectedCategories, setCategories, setDifficulty } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  // FIX: Determine if the category step should be skipped for the current game type.
  const skipCategoryStep = gameType === 'formation';

  const [step, setStep] = useState(1);
  const totalSteps = skipCategoryStep ? 2 : 3;

  // FIX: If skipping category step, set a default category automatically.
  useEffect(() => {
    if (skipCategoryStep) {
      setCategories(['general']);
    }
  }, [skipCategoryStep, setCategories]);


  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      navigate('/games');
    }
  };

  const handleModeSelect = (mode: 'single' | 'competitive') => {
    setGameMode(mode);
    setStep(2);
  };

  const handleCategoryToggle = (category: GameCategory) => {
    if (category === 'general') {
      setCategories(['general']);
      return;
    }
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category && c !== 'general')
      : [...selectedCategories.filter(c => c !== 'general'), category];
    if (newSelection.length === 0) {
      setCategories(['general']);
    } else {
      setCategories(newSelection);
    }
  };

  const handleContinueFromCategories = () => {
    if (selectedCategories.length > 0) {
      setStep(3);
    }
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    const { gameMode } = useGameMode.getState();
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate(`/game/${gameType}`);
    }
  };

  const renderStepContent = () => {
    // FIX: Adjust step logic based on whether the category step is skipped.
    let currentStepLogic = step;
    if (skipCategoryStep && step === 2) {
      currentStepLogic = 3; // If skipping, step 2 is actually the difficulty selection.
    }

    switch (currentStepLogic) {
      case 1: // Step 1: Select Mode
        return <ModeSelector onSelect={handleModeSelect} />;
      case 2: // Step 2: Select Category (only if not skipped)
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
      case 3: // Step 3 (or 2 if skipping): Select Difficulty
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
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        <Card className="p-6 sm:p-10 bg-card/80 backdrop-blur-sm">
          {renderStepContent()}
        </Card>
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
