// src/components/atoms/Logo.tsx
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function Logo({ showText = true, showBadge = true, className }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-3 hover:opacity-80 transition-opacity", className)}>
      <div className="relative">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ⚡
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-warning to-warning-light rounded-full animate-pulse" />
      </div>
      {showText && (
        <div className="hidden sm:block">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PowerLetter
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">Educational Puzzles</p>
        </div>
      )}
      {showBadge && (
        <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-primary/10 to-secondary/10 hidden sm:inline">
          Beta
        </Badge>
      )}
    </Link>
  );
}

export default Logo;
