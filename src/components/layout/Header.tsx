// src/components/layout/Header.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { cn } from "@/lib/utils";
import { useGameMode } from "@/hooks/useGameMode";

interface HeaderProps {
  currentView?: "home" | "selection" | "play";
  showLanguage?: boolean; // new optional prop
}

export function Header({ currentView, showLanguage = true }: HeaderProps) {
  const { language: currentLanguage, setLanguage: onLanguageChange } = useGameMode();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo and Title */}
        <Link to="/PowerLetter-for-Puzzles/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ⚡
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-warning to-warning-light rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PowerLetter
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Educational Puzzles
            </p>
          </div>
          <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-primary/10 to-secondary/10">
            Beta
          </Badge>
        </Link>

        {/* Navigation */}
        <nav className="">
          <Link to="/PowerLetter-for-Puzzles/">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                currentView === "home" && "text-foreground bg-accent"
              )}
            >
              Home
            </Button>
          </Link>
          <Link to="/PowerLetter-for-Puzzles/games">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                currentView === "selection" && "text-foreground bg-accent"
              )}
            >
              Games
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Help
          </Button>
        </nav>

        {/* Language Switch (optional) */}
        <div className="flex items-center gap-4">
          {showLanguage && (
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />
          )}
        </div>
      </div>
    </header>
  );
}
