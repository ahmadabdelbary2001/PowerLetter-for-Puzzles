// src/pages/GameSettingsPage.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/organisms/Header';
import { DifficultySelector } from '@/components/molecules/DifficultySelector';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import { getGameConfig } from '@/games/GameRegistry';
import { 
  ArrowLeft, ArrowRight, BrainCircuit, FlaskConical, Globe, Shapes, Apple, Palette, 
  Music, Car, Clapperboard, Utensils, GlassWater, Heart, Swords, Cake, Shirt, Tv, Gamepad, User
} from 'lucide-react';
import type { GameCategory } from '@/types/game';

const difficultyOptions = [
  { id: 'easy' as const, labelKey: 'easy', color: 'bg-green-500 hover:bg-green-600' },
  { id: 'medium' as const, labelKey: 'medium', color: 'bg-yellow-500 hover:bg-yellow-600' },
  { id: 'hard' as const, labelKey: 'hard', color: 'bg-red-500 hover:bg-red-600' },
];

const categoryIconMap: Record<GameCategory, React.ReactNode> = {
  animals: <BrainCircuit size={48} />,
  science: <FlaskConical size={48} />,
  geography: <Globe size={48} />,
  'fruits-and-vegetables': <Apple size={48} />,
  shapes: <Shapes size={48} />,
  general: <Palette size={48} />,
  anime: <Heart size={48} />,
  cars: <Car size={48} />,
  cartoons: <Clapperboard size={48} />,
  characters: <User size={48} />,
  clothes: <Shirt size={48} />,
  drinks: <GlassWater size={48} />,
  foods: <Utensils size={48} />,
  football: <Globe size={48} />,
  gamers: <Gamepad size={48} />,
  'k-pop': <Music size={48} />,
  series: <Tv size={48} />,
  spy: <Swords size={48} />,
  sweets: <Cake size={48} />,
};

// --- CRITICAL FIX ---
// The redundant toCamelCase helper function has been removed from this file.
// The logic is now centralized in CategorySelector.tsx.

const GameSettingsPage: React.FC = () => {
  const { settingType, gameType } = useParams<{ settingType: 'difficulty' | 'category', gameType: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const {
    difficulty,
    setDifficulty,
    categories,
    setCategories,
  } = useGameMode();

  const gameConfig = getGameConfig(gameType);

  const handleDone = () => {
    navigate(`/game/${gameType}`);
  };

  const handleCategoryToggle = (cat: GameCategory) => {
    setCategories(
      categories.includes(cat)
        ? categories.filter(c => c !== cat)
        : [...categories, cat]
    );
  };

  const getTitle = () => {
    if (settingType === 'difficulty') return t.changeLevel;
    if (settingType === 'category') return t.changeCategory;
    return t.gameSettings;
  };

  // --- CRITICAL FIX ---
  // The call to toCamelCase is removed. Pass the raw catId as the labelKey.
  // CategorySelector will handle the conversion internally.
  const displayCategories = (gameConfig?.availableCategories || []).map(catId => ({
    id: catId,
    labelKey: catId,
    icon: categoryIconMap[catId],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header currentView="play" />
      <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-4xl" dir={dir}>
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl sm:text-3xl">{getTitle()}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {settingType === 'difficulty' && (
                <>
                  <DifficultySelector difficulties={difficultyOptions} onDifficultySelect={setDifficulty} />
                  <p className="text-center text-muted-foreground">{t.difficulty}: {t[difficulty]}</p>
                </>
              )}
              {settingType === 'category' && (
                <CategorySelector
                  categories={displayCategories}
                  selectedCategories={categories}
                  onCategoryToggle={handleCategoryToggle}
                />
              )}

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
                  {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  {t.back}
                </Button>
                <Button onClick={handleDone} className="flex items-center gap-2">
                  {t.confirm ?? 'Done'}
                  {dir === 'rtl' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GameSettingsPage;
