// src/components/molecules/SolutionBoxes.tsx
import { useState, useEffect } from "react"
import { SolutionBox } from "@/components/atoms/SolutionBox"
import { cn } from "@/lib/utils"

interface SolutionBoxesProps {
  solution: string
  currentWord: string
  className?: string
}

export function SolutionBoxes({ solution, currentWord, className }: SolutionBoxesProps) {
  const solutionChars = [...solution];
  const currentChars = [...currentWord];

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

  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {solutionChars.map((_, index) => (
        <SolutionBox
          key={index}
          char={currentChars[index] || ''}
          filled={!!currentChars[index]}
          size={deviceType}
        />
      ))}
    </div>
  );
}
