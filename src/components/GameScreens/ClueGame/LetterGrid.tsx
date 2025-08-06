import { cn } from "@/lib/utils"

interface LetterGridProps {
  letters: string[]
  selectedIndices: number[]
  onLetterClick: (index: number) => void
  disabled?: boolean
  hintIndices: number[] // Changed to array
  className?: string
}

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

  const renderRow = (rowLetters: string[], startIndex: number) => (
    <div className="flex flex-wrap justify-center gap-3">
      {rowLetters.map((letter, rowIndex) => {
        const origIndex = originalIndex(startIndex + rowIndex);
        const isSelected = selectedIndices.includes(origIndex);
        const isHint = hintIndices.includes(origIndex);
        
        return (
          <button
            key={origIndex}
            onClick={() => onLetterClick(origIndex)}
            disabled={disabled || isHint}
            className={cn(
              "w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all duration-300 relative",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "shadow-card",
              {
                "bg-green-100 border-green-500 text-green-800 cursor-default": isHint,
                "bg-primary border-primary text-primary-foreground": isSelected && !isHint,
                "bg-card border-border text-card-foreground hover:border-primary/30": 
                  !isSelected && !isHint,
                "opacity-80": disabled,
              }
            )}
          >
            {letter}
            {isHint && (
              <span className="absolute -top-1 -right-1 text-xs">🔒</span>
            )}
          </button>
        );
      })}
    </div>
  );

  // Split letters into two rows
  const midPoint = Math.ceil(displayLetters.length / 2);
  const firstRow = displayLetters.slice(0, midPoint);
  const secondRow = displayLetters.slice(midPoint);

  return (
    <div className={cn("space-y-4", className)}>
      {renderRow(firstRow, 0)}
      {renderRow(secondRow, midPoint)}
    </div>
  );
}