// src/components/molecules/DifficultySelector.tsx
/**
 * DifficultySelector - A component for selecting game difficulty
 * 
 * This component displays a set of buttons representing different difficulty levels.
 * It's used in the game setup process to allow players to choose the difficulty
 * of the questions they want to play with.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { Difficulty } from "@/types/game";

/**
 * Data structure for a difficulty option
 */
interface DifficultyOption {
  /** Unique identifier for the difficulty level */
  id: Difficulty;
  /** Translation key for the difficulty label */
  labelKey: string;
  /** CSS color class for the difficulty button */
  color: string;
}

/**
 * Props for the DifficultySelector component
 */
interface DifficultySelectorProps {
  /** Array of available difficulty options */
  difficulties: DifficultyOption[];
  /** Callback function when a difficulty is selected */
  onDifficultySelect: (difficulty: Difficulty) => void;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * DifficultySelector component - A set of difficulty selection buttons
 * 
 * This component renders a responsive set of buttons representing different
 * difficulty levels. Each button has a distinct color and displays a translated
 * label. Users can click on buttons to select their preferred difficulty level.
 */
export function DifficultySelector({
  difficulties,
  onDifficultySelect,
  className
}: DifficultySelectorProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col sm:flex-row justify-center gap-4 sm:gap-8", className)}>
      {difficulties.map(diff => (
        <Button
          key={diff.id}
          onClick={() => onDifficultySelect(diff.id)}
          className={cn(
            'h-24 w-full sm:w-40 text-xl font-bold text-white shadow-lg hover:scale-105 transition-transform',
            diff.color
          )}
        >
          {/* Translated difficulty label */}
          {t[diff.labelKey as keyof typeof t]}
        </Button>
      ))}
    </div>
  );
}