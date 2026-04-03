// src/components/molecules/LetterGrid.tsx
/**
 * LetterGrid - A responsive grid of letter selection boxes
 * 
 * This component displays a grid of letters that players can select to form words.
 * It's responsive and adjusts its layout based on the device type and screen size.
 * The component supports highlighting selected letters and hint letters.
 */
import { useState, useEffect } from "react"
import { LetterBox } from "@/components/atoms/LetterBox"
import { cn } from "@/lib/utils"

/**
 * Props for the LetterGrid component
 */
interface LetterGridProps {
  /** Array of letters to display in the grid */
  letters: string[]
  /** Array of indices representing selected letters */
  selectedIndices: number[]
  /** Callback function when a letter is clicked */
  onLetterClick: (index: number) => void
  /** Whether the grid is disabled (non-interactive) */
  disabled?: boolean
  /** Array of indices representing hint letters */
  hintIndices: number[]
  /** Additional CSS classes for custom styling */
  className?: string
}

/**
 * LetterGrid component - A responsive grid of selectable letters
 * 
 * This component renders a responsive grid of LetterBox components. It automatically
 * adjusts the number of letters per row based on the device type and screen size.
 * The component supports highlighting selected letters and hint letters, and can
 * be disabled to prevent interaction.
 */
export function LetterGrid({
  letters,
  selectedIndices,
  onLetterClick,
  disabled = false,
  hintIndices,
  className
}: LetterGridProps) {
  // Handle RTL layout
  const displayLetters = letters;
  const originalIndex = (displayIndex: number) => displayIndex;

  // State to track device type
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'computer'>('mobile');

  /**
   * Effect to determine device type based on screen width
   * This effect sets up a resize listener to update the device type when the
   * window is resized, ensuring the grid remains responsive.
   */
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width >= 1024) { // lg breakpoint
        setDeviceType('computer');
      } else if (width >= 768) { // md breakpoint
        setDeviceType('tablet');
      } else {
        setDeviceType('mobile');
      }
    };

    // Initial check
    checkDeviceType();

    // Add event listener for window resize
    window.addEventListener('resize', checkDeviceType);

    // Cleanup
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  /**
   * Determines the optimal number of letters per row based on device type and letter count
   * @returns The number of letters that should be displayed in each row
   */
  const getLettersPerRow = () => {
    const letterCount = displayLetters.length;

    if (deviceType === 'computer') {
      if (letterCount <= 12) return 6; // Easy
      if (letterCount <= 18) return 9; // Medium
      return 12; // Hard
    } else if (deviceType === 'tablet') {
      if (letterCount <= 12) return 6; // Easy
      if (letterCount <= 18) return 6; // Medium
      return 8; // Hard
    } else { // mobile
      if (letterCount <= 12) return 4; // Easy
      if (letterCount <= 18) return 6; // Medium
      return 6; // Hard
    }
  };

  /**
   * Renders a single row of letters
   * @param rowLetters - The letters to display in this row
   * @param startIndex - The starting index of this row in the original letters array
   * @returns A JSX element representing a row of letter boxes
   */
  const renderRow = (rowLetters: string[], startIndex: number) => (
    <div className="flex flex-wrap justify-center gap-3">
      {rowLetters.map((letter, rowIndex) => {
        const origIndex = originalIndex(startIndex + rowIndex);
        const isSelected = selectedIndices.includes(origIndex);
        const isHint = hintIndices.includes(origIndex);

        return (
          <LetterBox
            key={origIndex}
            letter={letter}
            isSelected={isSelected}
            isHint={isHint}
            disabled={disabled}
            onClick={() => onLetterClick(origIndex)}
            deviceType={deviceType}
          />
        );
      })}
    </div>
  );

  // Split letters into rows based on responsive layout
  const lettersPerRow = getLettersPerRow();
  const rows = [];

  for (let i = 0; i < displayLetters.length; i += lettersPerRow) {
    rows.push(displayLetters.slice(i, i + lettersPerRow));
  }

  return (
    <div className={cn("space-y-4", className)}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex}>
          {renderRow(row, rowIndex * lettersPerRow)}
        </div>
      ))}
    </div>
  );
}