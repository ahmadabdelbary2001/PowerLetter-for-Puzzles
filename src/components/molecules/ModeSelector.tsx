// src/components/molecules/ModeSelector.tsx
/**
 * ModeSelector - A component for selecting game mode
 * 
 * This component displays a set of cards representing different game modes.
 * It's used in the game setup process to allow players to choose between
 * single player and competitive modes.
 */
import { Card, CardTitle } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Props for the ModeSelector component
 */
interface ModeSelectorProps {
  /** Callback function when a mode is selected */
  onSelect: (mode: 'single' | 'competitive') => void;
}

/**
 * ModeSelector component - A set of cards for selecting game mode
 * 
 * This component renders a responsive grid of cards representing different
 * game modes. Each card displays an icon and a translated label. Users can
 * click on cards to select their preferred game mode.
 */
export function ModeSelector({ onSelect }: ModeSelectorProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* Title for the mode selection section */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t.selectMode}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single player mode card */}
        <Card onClick={() => onSelect('single')} className="text-center p-6 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 hover:shadow-xl">
          <User className="mx-auto text-blue-500 mb-4" size={64} />
          <CardTitle className="text-xl font-semibold">{t.singlePlayer}</CardTitle>
        </Card>
        {/* Competitive mode card */}
        <Card onClick={() => onSelect('competitive')} className="text-center p-6 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 hover:shadow-xl">
          <Users className="mx-auto text-green-500 mb-4" size={64} />
          <CardTitle className="text-xl font-semibold">{t.competitive}</CardTitle>
        </Card>
      </div>
    </>
  );
}