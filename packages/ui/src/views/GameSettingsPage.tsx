"use client";

import React from 'react';
import { useGameMode, useTranslation } from "@powerletter/core";
import { getGameConfig } from "../registry/GameRegistry";
import { 
  ArrowLeft, ArrowRight, BrainCircuit, FlaskConical, Globe, Shapes, Apple, Palette, 
  Music, Car, Clapperboard, Utensils, GlassWater, Heart, Swords, Cake, Shirt, Tv, Gamepad, User
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import { DifficultySelector } from '../molecules/DifficultySelector';
import { CategorySelector } from '../molecules/CategorySelector';
import { Header } from '../organisms/Header';
import { useAppParams, useAppRouter } from '../contexts/RouterContext';
import type { GameCategory } from '@core/shared/types/game';

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

export interface GameSettingsPageProps {
  settingType?: 'difficulty' | 'category';
  gameType?: string;
}

const GameSettingsPage: React.FC<GameSettingsPageProps> = ({ settingType: propSettingType, gameType: propGameType }) => {
  const { settingType: paramSettingType, gameType: paramGameType } = useAppParams<{ settingType: 'difficulty' | 'category', gameType: string }>();
  const settingType = propSettingType || paramSettingType;
  const gameType = propGameType || paramGameType;
  const router = useAppRouter();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const {
    difficulty,
    setDifficulty,
    categories,
    setCategories,
  } = useGameMode();

  const gameConfig = getGameConfig(gameType || '');

  const handleDone = () => {
    router.push(`/game/${gameType}`);
  };

  const handleCategoryToggle = (cat: GameCategory) => {
    setCategories(
      categories.includes(cat)
        ? categories.filter((c: GameCategory) => c !== cat)
        : [...categories, cat]
    );
  };

  const getTitle = () => {
    if (settingType === 'difficulty') return t('changeLevel', { ns: 'selection' });
    if (settingType === 'category') return t('changeCategory', { ns: 'selection' });
    return t('gameSettings', { ns: 'selection' });
  };

  const displayCategories = (gameConfig?.availableCategories || []).map((catId: string) => ({
    id: catId as GameCategory,
    labelKey: catId,
    icon: categoryIconMap[catId as GameCategory],
  }));

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 bg-linear-to-br from-background via-muted/20 to-background -z-10" />
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
                  <p className="text-center text-muted-foreground">
                    {t('difficulty', { ns: 'common' })}: {t(difficulty, { ns: 'common' })}
                  </p>
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
                <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
                  {dir === 'rtl' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  {t('back')}
                </Button>
                <Button onClick={handleDone} className="flex items-center gap-2">
                  {t('confirm')}
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
