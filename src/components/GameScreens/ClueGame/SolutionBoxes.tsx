import { cn } from "@/lib/utils"

interface SolutionBoxesProps {
  solution: string
  currentWord: string
  className?: string
}

export function SolutionBoxes({ solution, currentWord, className }: SolutionBoxesProps) {
  const solutionChars = [...solution];
  const currentChars = [...currentWord];

  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {solutionChars.map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-12 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold",
            currentChars[index] ? "bg-primary border-primary text-primary-foreground" : "bg-card"
          )}
        >
          {currentChars[index] || ''}
        </div>
      ))}
    </div>
  );
}