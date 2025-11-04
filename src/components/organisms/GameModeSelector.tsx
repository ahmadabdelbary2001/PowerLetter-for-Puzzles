// src\components\organisms\GameModeSelector.tsx
/**
 * @description A multi-step wizard for configuring game settings.
 * Allows users to select game mode, categories, and difficulty level.
 * Features a step-by-step UI with navigation controls.
 *
 * NOTE: Special behaviour for 'outside-the-story':
 *  - Mode selection is skipped and automatically set to 'competitive'
 *  - After selecting category, we skip difficulty and go straight to team-config
 *  - Category list for each game can be customized here
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, ArrowLeft, PawPrint, FlaskConical, Globe, BrainCircuit, Apple, Music, Car, 
  Clapperboard, Utensils, GlassWater, Heart, Swords, Cake, Shirt, Tv, Gamepad, User 
} from 'lucide-react';
import { useGameMode } from '@/hooks/useGameMode';
import { useTranslation } from "@/hooks/useTranslation";
import { Header } from '@/components/organisms/Header';
import { StepIndicator } from '@/components/atoms/StepIndicator';
import { ModeSelector } from '@/components/molecules/ModeSelector';
import { CategorySelector } from '@/components/molecules/CategorySelector';
import { DifficultySelector } from '@/components/molecules/DifficultySelector';
import { useNavigate, useParams } from 'react-router-dom';
import type { GameCategory, Difficulty } from '@/types/game';

// Per-game category sets (customize as needed)
const CATEGORIES_BY_GAME: Record<string, readonly { id: GameCategory; icon: React.ReactNode; labelKey: string }[]> = {
  // Clue (adult) - includes "general"
  clue: [
    { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
  ],

  // Outside the story (adult) - NO 'general' option
  'outside-the-story': [
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'anime', icon: <Heart size={48} />, labelKey: 'anime' },
    { id: 'cars', icon: <Car size={48} />, labelKey: 'cars' },
    { id: 'cartoons', icon: <Clapperboard size={48} />, labelKey: 'cartoons' },
    { id: 'characters', icon: <User size={48} />, labelKey: 'characters' },
    { id: 'clothes', icon: <Shirt size={48} />, labelKey: 'clothes' },
    { id: 'drinks', icon: <GlassWater size={48} />, labelKey: 'drinks' },
    { id: 'foods', icon: <Utensils size={48} />, labelKey: 'foods' },
    { id: 'football', icon: <Globe size={48} />, labelKey: 'football' },
    { id: 'fruits-and-vegetables', icon: <Apple size={48} />, labelKey: 'fruits-and-vegetables' },
    { id: 'gamers', icon: <Gamepad size={48} />, labelKey: 'gamers' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
    { id: 'k-pop', icon: <Music size={48} />, labelKey: 'k-pop' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'series', icon: <Tv size={48} />, labelKey: 'series' },
    { id: 'spy', icon: <Swords size={48} />, labelKey: 'spy' },
    { id: 'sweets', icon: <Cake size={48} />, labelKey: 'sweets' },
  ],

  // Default (fallback)
  default: [
    { id: 'general', icon: <BrainCircuit size={48} />, labelKey: 'generalKnowledge' },
    { id: 'animals', icon: <PawPrint size={48} />, labelKey: 'animals' },
    { id: 'science', icon: <FlaskConical size={48} />, labelKey: 'science' },
    { id: 'geography', icon: <Globe size={48} />, labelKey: 'geography' },
  ],
};

const difficulties = [
    { id: 'easy', labelKey: 'easy', color: 'bg-green-500' },
    { id: 'medium', labelKey: 'medium', color: 'bg-yellow-500' },
    { id: 'hard', labelKey: 'hard', color: 'bg-red-500' },
] as const;


const GameModeSelector: React.FC = () => {
  const { setGameMode, categories: selectedCategories, setCategories, setDifficulty } = useGameMode();
  const { translate, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();

  // Determine category list for this gameType (fallback to 'default')

  // If this game should auto-be competitive (skip explicit selection)
  const autoCompetitive = gameType === 'outside-the-story';
  // If we should skip difficulty step for this game (outside-the-story -> go to team-config)
  const skipDifficultyForOutside = gameType === 'outside-the-story';

  // Determine whether to skip category step for certain game types (existing behaviour)
  const skipCategoryStep = gameType === 'formation' || gameType === 'letter-flow';
  
  // Check if this is the outside-the-story game
  const isOutsideStory = gameType === 'outside-the-story';
  
  // Skip mode selection for outside-the-story game
  const skipModeStep = gameType === 'outside-the-story';

  const totalSteps = skipModeStep ? (skipCategoryStep ? 1 : 2) : (skipCategoryStep ? 2 : 3);
  const [step, setStep] = useState(1);

  // On mount: if autoCompetitive, set mode and immediately show category selection
  useEffect(() => {
    if (autoCompetitive) {
      setGameMode('competitive');
      setStep(2); // skip the explicit mode selection UI
    }
  }, [autoCompetitive, setGameMode]);

  // If skipping category step, set a default category automatically.
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
    // For outside-the-story game, don't include general category
    if (isOutsideStory && category === 'general') {
      return;
    }
    
    // maintain the special behavior for 'general' when it's present
    if (category === 'general') {
      setCategories(['general']);
      return;
    }
    
    // For outside-the-story game, only allow one category selection
    if (isOutsideStory) {
      if (selectedCategories.includes(category)) {
        // If clicking the same category, deselect it
        setCategories([]);
      } else {
        // If clicking a different category, select only that one
        setCategories([category]);
      }
      return;
    }
    
    // For other games, allow multiple selections
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
    if (selectedCategories.length === 0) return;

    // If this game skips difficulty, go directly to Team Config (competitive flow).
    if (skipDifficultyForOutside) {
      setGameMode('competitive'); // ensure competitive
      navigate(`/team-config/${gameType}`);
      return;
    }

    // otherwise go to difficulty step
    setStep(3);
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
    // Adjust step mapping based on whether the category step is skipped.
    let currentStepLogic = step;
    if (skipCategoryStep && step === 2) {
      currentStepLogic = 3; // If skipping, step 2 is actually the difficulty selection.
    }

    switch (currentStepLogic) {
      case 1: // Step 1: Select Mode
        return autoCompetitive ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium">{translate("selectMode")}</h3>
            <p className="text-sm text-muted-foreground">{translate("selectModeDesc")}</p>
            <div className="mt-4">
              <Button onClick={() => setStep(2)}>{translate("continue")}</Button>
            </div>
          </div>
        ) : (
          <ModeSelector onSelect={handleModeSelect} />
        );

      case 2: // Step 2: Select Category (only if not skipped)
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">{translate("selectCategory")}</h2>
            <p className="text-sm text-muted-foreground mb-2">
              {isOutsideStory 
                ? translate("selectSingleCategoryHint") 
                : translate("selectCategoryHint")}
            </p>
            <CategorySelector
              categories={[...(gameType && CATEGORIES_BY_GAME[gameType] ? CATEGORIES_BY_GAME[gameType] : CATEGORIES_BY_GAME.default)]}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
            <div className="flex justify-center mt-8">
              <Button onClick={handleContinueFromCategories} disabled={selectedCategories.length === 0}>
                {translate("continue")} {dir === 'rtl' ? <ArrowLeft className="w-4 h-4 mr-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </>
        );

      case 3: // Step 3 (or 2 if skipping): Select Difficulty
        return (
          <>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{translate("selectDifficulty")}</h2>
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
            {translate("back")}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default GameModeSelector;
