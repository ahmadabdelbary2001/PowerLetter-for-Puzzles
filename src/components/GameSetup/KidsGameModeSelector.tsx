// src/components/GameSetup/KidsGameModeSelector.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { User, Users, ArrowRight, ArrowLeft, PawPrint, Apple, Shapes, BrainCircuit, Check } from 'lucide-react';
import { useGameMode } from '../../hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Header } from '@/components/layout/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { GameCategory } from '@/types/game';

// --- Helper Components for Steps ---
const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div
        key={i}
        className={cn('h-2 rounded-full transition-all duration-300', i + 1 === currentStep ? 'w-8 bg-green-500' : 'w-4 bg-gray-300 dark:bg-gray-600')}
      />
    ))}
  </div>
);

const categoriesData = [
  { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
  { id: 'fruits', icon: <Apple size={48} />, labelKey: 'fruits' },
  { id: 'shapes', icon: <Shapes size={48} />, labelKey: 'shapes' },
  { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
] as const;

// --- Main Component ---
const KidsGameModeSelector: React.FC = () => {
  const { setGameMode, setCategories } = useGameMode();
  const { t, dir } = useTranslation();
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<GameCategory[]>([]);

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
    } else {
      // FIX: The back button on the first step should go to the Kids Game selection screen.
      navigate('/kids-games');
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
      if (newSelection.includes(category)) {
        return newSelection.filter(c => c !== category);
      } else {
        return [...newSelection, category];
      }
    });
  };

  const handleContinueFromCategories = () => {
    setCategories(selectedCategories);
    const { gameMode } = useGameMode.getState();
    if (gameMode === 'competitive') {
      navigate(`/team-config/${gameType}`);
    } else {
      navigate(`/game/${gameType}`);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Select Mode
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
      case 2: // Select Category
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{t.selectCategory}</h2>
            <p className="text-center text-muted-foreground mb-6">{t.selectCategoryDesc}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {categoriesData.map(cat => {
                const isSelected = selectedCategories.includes(cat.id as GameCategory);
                return (
                  <Card
                    key={cat.id}
                    onClick={() => handleCategoryToggle(cat.id as GameCategory)}
                    className={cn(
                      "text-center p-4 cursor-pointer hover:shadow-xl transition-all duration-300 relative",
                      isSelected ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <Header currentView="kids" />
      <main className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
        <StepIndicator currentStep={step} totalSteps={2} />
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

export default KidsGameModeSelector;
