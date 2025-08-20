// src/components/atoms/GameButton.tsx
/**
 * GameButton - A reusable button component for game controls
 * 
 * This component provides a standardized button style for all game controls.
 * It supports icons, different variants, and a special primary styling.
 */
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Props for the GameButton component
 */
interface GameButtonProps {
  /** Callback function when button is clicked */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Visual style variant of the button */
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  /** Additional CSS classes for custom styling */
  className?: string;
  /** Optional icon to display before the button text */
  icon?: LucideIcon;
  /** Content to display inside the button */
  children?: React.ReactNode;
  /** Whether this button should use primary styling (blue background) */
  isPrimary?: boolean;
}

/**
 * GameButton component - A customizable button for game controls
 * 
 * This component wraps the base Button component with game-specific styling
 * and functionality. It can display icons and apply special primary styling
 * for important actions.
 */
export function GameButton({
  onClick,
  disabled = false,
  variant = "outline",
  className,
  icon: Icon,
  children,
  isPrimary = false
}: GameButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={isPrimary ? "default" : variant}
      className={cn(
        isPrimary && "bg-blue-600 hover:bg-blue-700 text-white",
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </Button>
  );
}
