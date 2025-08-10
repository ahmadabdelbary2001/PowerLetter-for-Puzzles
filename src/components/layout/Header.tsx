import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { cn } from "@/lib/utils";
import { useGameMode } from "@/hooks/useGameMode";
import { Menu } from "lucide-react";
import React, { useEffect, useRef } from "react";
import ModeToggler from "./ModeToggler";

interface HeaderProps {
  currentView?: "home" | "selection" | "play";
  showLanguage?: boolean;
}

export function Header({ currentView, showLanguage = true }: HeaderProps) {
  const { language: currentLanguage, setLanguage: onLanguageChange } = useGameMode();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const mobileNavId = "mobile-navigation";

  // refs to handle outside-click closing
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node | null;
      if (!target) return;

      // if click is inside the mobile panel, do nothing
      if (mobilePanelRef.current && mobilePanelRef.current.contains(target)) return;

      // if click is on the hamburger/toggle button, do nothing
      if (toggleButtonRef.current && toggleButtonRef.current.contains(target)) return;

      // otherwise close the panel
      setMobileOpen(false);
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16 justify-between">
        {/* Logo / Brand */}
        <Link to="/PowerLetter-for-Puzzles/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ⚡
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-warning to-warning-light rounded-full animate-pulse" />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PowerLetter
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">Educational Puzzles</p>
          </div>

          <Badge variant="outline" className="ml-2 text-xs bg-gradient-to-r from-primary/10 to-secondary/10 hidden sm:inline">
            Beta
          </Badge>
        </Link>

        {/* Desktop nav (hidden on small screens) */}
        <nav className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Main">
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

        {/* Right side: language + theme toggler + hamburger */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          {showLanguage && (
            <>
              <div className="hidden sm:block">
                <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
              </div>
              <div className="sm:hidden">
                <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} compact />
              </div>
            </>
          )}

          {/* Theme toggler */}
          <div className="hidden sm:block">
            <ModeToggler />
          </div>
          <div className="sm:hidden">
            <ModeToggler compact />
          </div>

          {/* Mobile hamburger (attach ref so outside click ignores it) */}
          <div className="sm:hidden">
            <button
              ref={toggleButtonRef}
              aria-controls={mobileNavId}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((s) => !s)}
              className="p-2 rounded-md hover:bg-muted/10 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel (disclosure) */}
      {mobileOpen && (
        <div
          id={mobileNavId}
          ref={mobilePanelRef}
          className="sm:hidden border-t border-border/40 bg-background/95"
        >
          <div className="px-4 py-3 space-y-2">
            <Link to="/PowerLetter-for-Puzzles/" onClick={() => setMobileOpen(false)} className="block">
              <Button variant="ghost" size="sm" className={cn("w-full text-left", currentView === "home" && "bg-accent")}>
                Home
              </Button>
            </Link>

            <Link to="/PowerLetter-for-Puzzles/games" onClick={() => setMobileOpen(false)} className="block">
              <Button variant="ghost" size="sm" className={cn("w-full text-left", currentView === "selection" && "bg-accent")}>
                Games
              </Button>
            </Link>

            <Button variant="ghost" size="sm" className="w-full text-left" onClick={() => setMobileOpen(false)}>
              Help
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;