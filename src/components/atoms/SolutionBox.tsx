// src/components/atoms/SolutionBox.tsx
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const solutionBoxVariants = cva(
  "border-2 rounded-lg flex items-center justify-center font-bold",
  {
    variants: {
      size: {
        computer: "w-12 h-12 text-lg",
        tablet: "w-10 h-10 text-md",
        mobile: "w-8 h-8 text-sm",
      },
      filled: {
        true: "bg-primary border-primary text-primary-foreground",
        false: "bg-card",
      },
    },
    defaultVariants: {
      size: "mobile",
      filled: false,
    },
  }
);

interface SolutionBoxProps extends VariantProps<typeof solutionBoxVariants> {
  char?: string;
  className?: string;
}

export function SolutionBox({
  char = '',
  filled,
  size,
  className,
}: SolutionBoxProps) {
  return (
    <div className={cn(solutionBoxVariants({ size, filled }), className)}>
      {char}
    </div>
  );
}
