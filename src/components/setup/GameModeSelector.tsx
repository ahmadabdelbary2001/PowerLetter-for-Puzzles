// src\components\setup\GameModeSelector.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { User, Users, ArrowRight, ArrowLeft, PawPrint, FlaskConical, Globe, BrainCircuit, Check } from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { StepIndicator } from '@/components/atoms/StepIndicator';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
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

  const [step, setStep] = useState(1);

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
      setCategories(['general']); // Default to general if nothing is selected
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
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t.selectMode}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card onClick={() => handleModeSelect('single')} className="text-center p-6 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 hover:shadow-xl">
                <User className="mx-auto text-blue-500 mb-4" size={64} />
                <CardTitle className="text-xl font-semibold">{t.singlePlayer}</CardTitle>
              </Card>
              <Card onClick={() => handleModeSelect('competitive')} className="text-center p-6 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 hover:shadow-xl">
                <Users className="mx-auto text-green-500 mb-4" size={64} />
                <CardTitle className="text-xl font-semibold">{t.competitive}</CardTitle>
              </Card>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t.selectCategory}</h2>
            <p className="text-center text-muted-foreground mb-6">{t.selectCategoryDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categoriesData.map(cat => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <Card
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id as GameCategory)}
                    className={cn(
                      "text-center p-4 cursor-pointer hover:shadow-xl transition-all duration-300 relative",
                      isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check size={16} />
                      </div>
                    )}
                    <div className="text-gray-700 dark:text-gray-300">{cat.icon}</div>
                    <p className="mt-2 font-semibold text-sm sm:text-base">{t[cat.labelKey]}</p>
                  </Card>
                );
              })}
            </div>
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
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
              {difficulties.map(diff => (
                <Button key={diff.id} onClick={() => handleDifficultySelect(diff.id as Difficulty)} className={cn('h-24 w-full sm:w-40 text-xl font-bold text-white shadow-lg hover:scale-105 transition-transform', diff.color)}>
                  {t[diff.labelKey]}
                </Button>
              ))}
            </div>
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
        <StepIndicator currentStep={step} totalSteps={3} />
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
