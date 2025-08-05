import { cn } from "@/lib/utils"

interface LetterGridProps {
  letters: string[]
  selectedIndices: number[]
  onLetterClick: (index: number) => void
  disabled?: boolean
  className?: string
}

export function LetterGrid({ 
  letters, 
  selectedIndices, 
  onLetterClick, 
  disabled = false,
  className 
}: LetterGridProps) {
  // Split letters into two rows
  const midPoint = Math.ceil(letters.length / 2)
  const firstRow = letters.slice(0, midPoint)
  const secondRow = letters.slice(midPoint)

  const handleLetterClick = (_letter: string, originalIndex: number) => {
    if (disabled) return
    onLetterClick(originalIndex)
  }

  const renderRow = (rowLetters: string[], startIndex: number) => (
    <div className="flex flex-wrap justify-center gap-3">
      {rowLetters.map((letter, rowIndex) => {
        const originalIndex = startIndex + rowIndex
        const isSelected = selectedIndices.includes(originalIndex)
        
        return (
          <button
            key={originalIndex}
            onClick={() => handleLetterClick(letter, originalIndex)}
            disabled={disabled}
            className={cn(
              "w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "shadow-card hover:shadow-elegant active:scale-95",
              {
                "bg-card border-border text-card-foreground hover:border-primary/30": !isSelected,
                "bg-primary border-primary text-primary-foreground shadow-glow": isSelected,
                "opacity-50 cursor-not-allowed hover:border-border hover:shadow-card": disabled,
              }
            )}
          >
            {letter}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className={cn("space-y-4", className)}>
      {renderRow(firstRow, 0)}
      {renderRow(secondRow, midPoint)}
    </div>
  )
}