import { cn } from "@/lib/utils"

interface SolutionBoxProps {
  char?: string
  filled?: boolean
  className?: string
  deviceType?: 'mobile' | 'tablet' | 'computer'
}

export function SolutionBox({
  char = '',
  filled = false,
  className,
  deviceType = 'mobile'
}: SolutionBoxProps) {
  return (
    <div
      className={cn(
        deviceType === 'computer' ? "w-12 h-12 text-lg" :
        deviceType === 'tablet' ? "w-10 h-10 text-md" :
        "w-8 h-8 text-sm",
        "border-2 rounded-lg flex items-center justify-center font-bold",
        filled ? "bg-primary border-primary text-primary-foreground" : "bg-card",
        className
      )}
    >
      {char}
    </div>
  );
}
