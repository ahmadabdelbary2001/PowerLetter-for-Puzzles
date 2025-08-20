// src/components/atoms/Logo.tsx
/**
 * Logo - The application logo component
 * 
 * This component renders the PowerLetter logo with optional text and badge.
 * It's used throughout the application to provide consistent branding.
 * The logo is responsive and adapts its display based on screen size.
 */
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Props for the Logo component
 */
interface LogoProps {
  /** Whether to show the text alongside the logo icon */
  showText?: boolean;
  /** Whether to show the beta badge */
  showBadge?: boolean;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * Logo component - Renders the application logo
 * 
 * This component displays the PowerLetter logo consisting of a lightning bolt icon,
 * optional text, and an optional beta badge. It's a Link component that navigates
 * to the home page when clicked. The component is responsive and hides certain
 * elements on smaller screens.
 */
export function Logo({ showText = true, showBadge = true, className }: LogoProps) {
  return (
    <Link to="/" className={cn("flex items-center gap-3 hover:opacity-80 transition-opacity", className)}>
      <div className="relative">
        {/* Lightning bolt icon with gradient text */}
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ⚡
        </div>
        {/* Animated pulse indicator */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-warning to-warning-light rounded-full animate-pulse" />
      </div>
      {/* Logo text - hidden on small screens */}
      {showText && (
        <div className="hidden sm:block">
          <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PowerLetter
          </h1>
          <p className="text-xs text-muted-foreground -mt-1">Educational Puzzles</p>
        </div>
      )}
      {/* Beta badge - hidden on small screens */}
      {showBadge && (
        <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-primary/10 to-secondary/10 hidden sm:inline">
          Beta
        </Badge>
      )}
    </Link>
  );
}

export default Logo;
