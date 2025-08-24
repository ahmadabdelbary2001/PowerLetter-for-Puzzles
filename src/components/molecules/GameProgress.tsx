// src/components/molecules/GameProgress.tsx
/**
 * GameProgress - A component for displaying progress in the Letter Flow game
 *
 * This component displays the current progress in the Letter Flow game,
 * showing how many words have been found out of the total.
 */
import { cn } from "@/lib/utils"

/**
 * Props for the GameProgress component
 */
interface GameProgressProps {
  /** Array of found words */
  foundWords: Array<{
    word: string;
    cells: Array<{x: number, y: number, letter: string}>;
  }>;
  /** Total number of words to find */
  totalWords: number;
  /** Translation function for text */
  t: {
    selected: string;
    of: string;
  };
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * GameProgress component - Displays progress in the Letter Flow game
 *
 * This component renders a progress bar and text showing how many words
 * have been found out of the total. It provides a clear visual indication
 * of the player's progress in the game.
 */
export function GameProgress({
  foundWords,
  totalWords,
  t,
  className
}: GameProgressProps) {
  const progress = foundWords.length / totalWords;

  return (
    <div className={cn("mt-6 text-center", className)}>
      <div className="text-gray-600">
        {t.selected} {foundWords.length} {t.of} {totalWords}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
