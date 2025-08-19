// src/components/atoms/GameButton.tsx
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface GameButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost";
  className?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  isPrimary?: boolean;
}

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
