import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

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
  
  // State to track device type
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'computer'>('mobile');

  // Effect to determine device type based on screen width
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

  // Determine letters per row based on device type and number of letters
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
              "rounded-lg border-2 font-bold transition-all duration-300 relative",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "shadow-card",
              {
                "bg-green-100 border-green-500 text-green-800 cursor-default": isHint,
                "bg-primary border-primary text-primary-foreground": isSelected && !isHint,
                "bg-card border-border text-card-foreground hover:border-primary/30": !isSelected && !isHint,
                "opacity-80": disabled,
              }
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