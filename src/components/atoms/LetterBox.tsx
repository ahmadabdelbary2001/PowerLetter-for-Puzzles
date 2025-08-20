// src/components/atoms/LetterBox.tsx
/**
 * LetterBox - A component for displaying individual letters in word games
 * 
 * This component renders a clickable box containing a single letter.
 * It supports different visual states for selection, hints, and disabled states.
 * The component is responsive and adjusts its size based on the device type.
 */
import { cn } from "@/lib/utils"

/**
 * Props for the LetterBox component
 */
interface LetterBoxProps {
  /** The letter to display in the box */
  letter: string
  /** Whether this letter box is currently selected */
  isSelected?: boolean
  /** Whether this letter is a hint (automatically revealed) */
  isHint?: boolean
  /** Whether the letter box is disabled (non-interactive) */
  disabled?: boolean
  /** Callback function when the letter box is clicked */
  onClick?: () => void
  /** Additional CSS classes for custom styling */
  className?: string
  /** The type of device for responsive sizing */
  deviceType?: 'mobile' | 'tablet' | 'computer'
}

/**
 * LetterBox component - Displays a single letter in a styled box
 * 
 * This component is used in word games to display individual letters that players
 * can select to form words. It has different visual states for selected letters,
 * hint letters, and disabled letters. The component is responsive and adjusts
 * its size based on the device type.
 */
export function LetterBox({
  letter,
  isSelected = false,
  isHint = false,
  disabled = false,
  onClick,
  className,
  deviceType = 'mobile'
}: LetterBoxProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isHint}
      className={cn(
        "rounded-lg border-2 font-bold transition-all duration-300 relative",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "shadow-card",
        {
          "bg-green-100 border-green-500 text-green-800 cursor-default": isHint,
          "bg-primary border-primary text-primary-foreground": isSelected && !isHint,
          "bg-card border-border text-card-foreground hover:border-primary/30": !isSelected && !isHint,
          "opacity-80": disabled,
        },
        className
      )}
      style={{
        width: deviceType === 'computer' ? 'min(8vw, 56px)' :
               deviceType === 'tablet' ? 'min(10vw, 56px)' :
               'min(9vw, 48px)',
        height: deviceType === 'computer' ? 'min(8vw, 56px)' :
                deviceType === 'tablet' ? 'min(10vw, 56px)' :
                'min(9vw, 48px)',
        fontSize: deviceType === 'computer' ? 'min(3vw, 18px)' :
                  deviceType === 'tablet' ? 'min(4vw, 18px)' :
                  'min(4.2vw, 15px)',
      }}
    >
      {letter}
      {isHint && (
        <span className="absolute -top-1 -right-1 text-xs">🔒</span>
      )}
    </button>
  );
}
