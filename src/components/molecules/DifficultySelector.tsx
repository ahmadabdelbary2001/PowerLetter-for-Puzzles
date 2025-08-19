// src/components/molecules/DifficultySelector.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { Difficulty } from "@/types/game";

interface DifficultyOption {
  id: Difficulty;
  labelKey: string;
  color: string;
}

interface DifficultySelectorProps {
  difficulties: DifficultyOption[];
  onDifficultySelect: (difficulty: Difficulty) => void;
  className?: string;
}

export function DifficultySelector({ 
  difficulties, 
  onDifficultySelect,
  className 
}: DifficultySelectorProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex flex-col sm:flex-row justify-center gap-4 sm:gap-8", className)}>
      {difficulties.map(diff => (
        <Button 
          key={diff.id} 
          onClick={() => onDifficultySelect(diff.id)} 
          className={cn(
            'h-24 w-full sm:w-40 text-xl font-bold text-white shadow-lg hover:scale-105 transition-transform', 
            diff.color
          )}
        >
          {t[diff.labelKey as keyof typeof t]}
        </Button>
      ))}
    </div>
  );
}
