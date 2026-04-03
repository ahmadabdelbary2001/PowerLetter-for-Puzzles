// src/components/molecules/FoundWords.tsx
/**
 * FoundWords - A component for displaying found words in the Letter Flow game
 *
 * This component displays a list of words that the player has successfully found.
 * It's responsive and adjusts its layout based on the device type and screen size.
 */
import { cn } from "@/lib/utils"

/**
 * Props for the FoundWords component
 */
interface FoundWordsProps {
  /** Array of found words with their cells */
  foundWords: Array<{
    word: string;
    cells: Array<{x: number, y: number, letter: string}>;
  }>;
  /** Translation function for the title */
  t: {
    selected: string;
  };
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * FoundWords component - Displays found words in the Letter Flow game
 *
 * This component renders a responsive list of found words. It automatically
 * adjusts its layout based on the number of words. The component supports
 * highlighting found words and provides a clear visual indication of progress.
 */
export function FoundWords({
  foundWords,
  t,
  className
}: FoundWordsProps) {
  if (foundWords.length === 0) return null;

  return (
    <div className={cn("mt-6", className)}>
      <div className="text-lg font-semibold mb-2">{t.selected}:</div>
      <div className="flex flex-wrap gap-2">
        {foundWords.map((wordPath, index) => (
          <div
            key={index}
            className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
          >
            {wordPath.word}
          </div>
        ))}
      </div>
    </div>
  );
}
