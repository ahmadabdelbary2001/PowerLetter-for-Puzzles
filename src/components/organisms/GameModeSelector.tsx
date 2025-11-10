// src/components/organisms/GameModeSelector.tsx
/**
 * @description A multi-step wizard for configuring game settings.
 * --- This component now uses the shared GameSelectionLayout to render its UI. ---
 * It contains the complex, game-specific logic for skipping steps and selecting categories.
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { ModeSelector } from '@/components/molecules/ModeSelector';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import { DifficultySelector } from '@/components/molecules/DifficultySelector';
import { useNavigate, useParams } from 'react-router-dom';
import type { GameCategory, Difficulty } from '@/types/game';
import { GameSelectionLayout } from '../templates/GameSelectionLayout';
import { CATEGORIES_BY_GAME } from '@/config/gameCategories';

const difficulties = [
    { id: 'easy' as const, labelKey: 'easy', color: 'bg-green-500' },
    { id: 'medium' as const, labelKey: 'medium', color: 'bg-yellow-500' },
    { id: 'hard' as const, labelKey: 'hard', color: 'bg-red-500' },
] as const;

const GameModeSelector: React.FC = () => {
  const { gameMode, setGameMode, categories: selectedCategories, setCategories, setDifficulty } = useGameMode();
  // --- Destructure 't' instead of 'translate' ---
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  const isOutsideStory = gameType === 'outside-the-story';
  const skipModeStep = isOutsideStory;
  const skipCategoryStep = gameType === 'formation' || gameType === 'letter-flow';
  const skipDifficultyStep = isOutsideStory;

  const totalSteps = skipModeStep ? (skipCategoryStep ? 1 : 2) : (skipCategoryStep ? 2 : 3);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (skipModeStep) {
      setGameMode('competitive');
      setStep(2);
    }
  }, [skipModeStep, setGameMode]);

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
    if (isOutsideStory) {
      setCategories(selectedCategories.includes(category) ? [] : [category]);
      return;
    }
    if (category === 'general') {
      setCategories(['general']);
      return;
    }
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category && c !== 'general')
      : [...selectedCategories.filter(c => c !== 'general'), category];
    setCategories(newSelection.length > 0 ? newSelection : ['general']);
  };

  const handleContinueFromCategories = () => {
    if (selectedCategories.length === 0) return;
    if (skipDifficultyStep) {
      navigate(`/team-config/${gameType}`);
      return;
    }
    setStep(3);
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setDifficulty(difficulty);
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate(`/game/${gameType}`);
    }
  };

  const renderStepContent = () => {
    let currentStepLogic = step;
    if (skipCategoryStep && step === 2) currentStepLogic = 3;

    switch (currentStepLogic) {
      case 1:
        return <ModeSelector onSelect={handleModeSelect} />;
      case 2:
        return (
          <>
            {/* --- Use t() with namespace --- */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t("selectCategory", { ns: 'selection' })}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {isOutsideStory ? t("selectSingleCategoryHint", { ns: 'selection' }) : t("selectCategoryHint", { ns: 'selection' })}
            </p>
            <CategorySelector
              categories={gameType ? [...(CATEGORIES_BY_GAME[gameType] || CATEGORIES_BY_GAME.default)] : [...CATEGORIES_BY_GAME.default]}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            <div className="flex justify-center mt-8">
              <Button onClick={handleContinueFromCategories} disabled={selectedCategories.length === 0}>
                {/* --- Use t() (default ns is 'common') --- */}
                {t("continue")} {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            {/* --- Use t() with namespace --- */}
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t("selectDifficulty", { ns: 'selection' })}</h2>
            <DifficultySelector difficulties={[...difficulties]} onDifficultySelect={handleDifficultySelect} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <GameSelectionLayout
      currentStep={step}
      totalSteps={totalSteps}
      onBack={handleBack}
      headerView="selection"
    >
      {renderStepContent()}
    </GameSelectionLayout>
  );
};

export default GameModeSelector;
