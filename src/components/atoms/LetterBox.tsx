// src/components/atoms/LetterBox.tsx
import { cn } from "@/lib/utils"

interface LetterBoxProps {
  letter: string
  isSelected?: boolean
  isHint?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  deviceType?: 'mobile' | 'tablet' | 'computer'
}

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
