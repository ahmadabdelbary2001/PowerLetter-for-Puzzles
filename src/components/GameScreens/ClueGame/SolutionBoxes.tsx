import { cn } from "@/lib/utils"

interface SolutionBoxesProps {
  solution: string
  currentWord: string
  className?: string
}

export function SolutionBoxes({ solution, currentWord, className }: SolutionBoxesProps) {
  const solutionChars = [...solution.replace(/\s/g, '')]
  const currentChars = [...currentWord.replace(/\s/g, '')]

  return (
    <div className={cn("flex flex-wrap justify-center gap-2", className)}>
      {solutionChars.map((char, index) => (
        <div
          key={index}
          className={cn(
            "w-12 h-12 border-2 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-300",
            {
              "border-muted bg-muted/20": !currentChars[index],
              "border-primary bg-primary/10 text-primary": currentChars[index] && currentChars[index] === char,
              "border-destructive bg-destructive/10 text-destructive": currentChars[index] && currentChars[index] !== char
            }
          )}
        >
          {currentChars[index] || ''}
        </div>
      ))}
    </div>
  )
}