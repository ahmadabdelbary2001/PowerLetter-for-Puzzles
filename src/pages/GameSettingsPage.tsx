// src/pages/GameSettingsPage.tsx
import React from 'react';
import { useGameMode } from '@/hooks/useGameMode';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/organisms/Header';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import type { Difficulty, GameCategory } from '@/types/game';
import { Globe, Atom, Footprints, Film } from 'lucide-react';

// Define available options here
const difficultyOptions: { id: Difficulty; labelKey: string; color: string }[] = [
  { id: 'easy', labelKey: 'easy', color: 'bg-green-500' },
  { id: 'medium', labelKey: 'medium', color: 'bg-yellow-500' },
  { id: 'hard', labelKey: 'hard', color: 'bg-red-500' },
];

const categoryOptions: { id: GameCategory; labelKey: string; icon: React.ReactNode }[] = [
  { id: 'general', labelKey: 'general', icon: <Globe /> },
  { id: 'science', labelKey: 'science', icon: <Atom /> },
  { id: 'animals', labelKey: 'animals', icon: <Footprints /> },
  { id: 'geography', labelKey: 'geography', icon: <Film /> },
];

const GameSettingsPage: React.FC = () => {
  const { gameType, settingType } = useParams<{ gameType: string; settingType: 'difficulty' | 'category' }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    difficulty: currentDifficulty,
    setDifficulty,
    categories,
    setCategories,
  } = useGameMode();

  const handleReturnToGame = () => {
    navigate(`/game/${gameType}`);
  };

  const renderSelector = () => {
    if (settingType === 'difficulty') {
      return (
        <>
          <h1 className="text-3xl font-bold mb-8">{t.changeLevel ?? 'Change Level'}</h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 w-full max-w-lg">
            {difficultyOptions.map(diff => (
              <Button
                key={diff.id}
                onClick={() => {
                  setDifficulty(diff.id);
                  handleReturnToGame();
                }}
                className={`h-24 w-full sm:w-40 text-xl font-bold text-white shadow-lg hover:scale-105 transition-transform ${diff.color}`}
                // FIX: Use the currentDifficulty from state to show which button is active
                variant={currentDifficulty === diff.id ? 'default' : 'secondary'}
              >
                {t[diff.labelKey as keyof typeof t]}
              </Button>
            ))}
          </div>
        </>
      );
    }

    if (settingType === 'category') {
      return (
        <>
          <h1 className="text-3xl font-bold mb-8">{t.changeCategory ?? 'Change Categories'}</h1>
          <CategorySelector
            categories={categoryOptions}
            selectedCategories={categories}
            onCategoryToggle={(cat) => {
              const newSelection = categories.includes(cat)
                ? categories.filter(c => c !== cat)
                : [...categories, cat];
              setCategories(newSelection);
            }}
          />
          <Button onClick={handleReturnToGame} className="mt-8 w-full max-w-xs">
            {t.confirm ?? 'Confirm'}
          </Button>
        </>
      );
    }

    return <p>Invalid setting type.</p>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView="play" />
      <main className="container mx-auto flex flex-col items-center justify-center text-center p-8">
        {renderSelector()}
      </main>
    </div>
  );
};

export default GameSettingsPage;
