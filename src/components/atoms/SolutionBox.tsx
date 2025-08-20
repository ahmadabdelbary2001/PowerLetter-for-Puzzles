// src/components/atoms/SolutionBox.tsx
/**
 * SolutionBox - A component for displaying individual characters in the solution area
 * 
 * This component renders a box that can display a single character of the solution.
 * It supports different sizes and visual states (filled/empty) and is used in word games
 * to show the player's progress toward the solution.
 */
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Class variants for the SolutionBox component
 * 
 * This defines the different styles that can be applied to the solution box
 * based on its size and filled state.
 */
const solutionBoxVariants = cva(
  "border-2 rounded-lg flex items-center justify-center font-bold",
  {
    variants: {
      /** Size variants for different device types */
      size: {
        computer: "w-12 h-12 text-lg",
        tablet: "w-10 h-10 text-md",
        mobile: "w-8 h-8 text-sm",
      },
      /** Whether the box contains a character or is empty */
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

/**
 * Props for the SolutionBox component
 */
interface SolutionBoxProps extends VariantProps<typeof solutionBoxVariants> {
  /** The character to display in the box */
  char?: string;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * SolutionBox component - Displays a single character in the solution area
 * 
 * This component is used in word games to show the player's progress toward the solution.
 * Each box represents a position in the solution word or phrase. The component is
 * responsive and adjusts its size based on the device type.
 */
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
