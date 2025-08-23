// src/components/molecules/LetterCircle.tsx
/**
 * @description A responsive circular arrangement of letter buttons.
 * This component displays letters in a circular pattern with a shuffle button in the center.
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';

interface LetterCircleProps {
  letters: string[];
  /** FIX: Changed type from Set<number> to number[] to match the hook's state. */
  usedLetterIndices: number[];
  onLetterSelect: (letter: string, index: number) => void;
  onShuffle: () => void;
  className?: string;
}

/**
 * Renders a responsive, circular "wheel" of letter buttons for word games.
 */
export const LetterCircle: React.FC<LetterCircleProps> = ({
  letters,
  usedLetterIndices,
  onLetterSelect,
  onShuffle,
  className
}) => {
  const [circleSize, setCircleSize] = useState(180);
  const [buttonSize, setButtonSize] = useState(40);

  useEffect(() => {
    const updateSizes = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 380) { setCircleSize(140); setButtonSize(32); }
      else if (screenWidth < 640) { setCircleSize(160); setButtonSize(36); }
      else if (screenWidth < 768) { setCircleSize(180); setButtonSize(40); }
      else { setCircleSize(200); setButtonSize(44); }
    };
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  return (
    <div className={cn("relative mx-auto my-4", className)} style={{ width: `${circleSize}px`, height: `${circleSize}px` }}>
      {letters.map((letter, i) => {
        const angle = (i / letters.length) * 2 * Math.PI;
        const radius = letters.length > 6 ? circleSize * 0.4 : circleSize * 0.35;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isDisabled = usedLetterIndices.includes(i);

        return (
          <Button
            key={`${letter}-${i}`}
            onClick={() => onLetterSelect(letter, i)}
            className={cn(
              "absolute rounded-full font-bold transition-all",
              isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'
            )}
            style={{
              width: `${buttonSize}px`, height: `${buttonSize}px`,
              fontSize: `${buttonSize * 0.5}px`,
              top: `calc(50% - ${buttonSize / 2}px)`,
              left: `calc(50% - ${buttonSize / 2}px)`,
              transform: `translate(${x}px, ${y}px)`
            }}
            disabled={isDisabled}
          >
            {letter}
          </Button>
        );
      })}
      <Button
        size="icon"
        variant="ghost"
        onClick={onShuffle}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: `${buttonSize * 1.6}px`, height: `${buttonSize * 1.6}px` }}
      >
        <RefreshCw className="text-muted-foreground" style={{ width: `${buttonSize * 0.6}px`, height: `${buttonSize * 0.6}px` }} />
      </Button>
    </div>
  );
};

export default LetterCircle;
