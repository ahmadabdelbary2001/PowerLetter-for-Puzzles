// src/components/organisms/Header.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import { cn } from "@/lib/utils";
import { useGameMode } from "@/hooks/useGameMode";
import { Menu, ToyBrick } from "lucide-react";
import React, { useEffect, useRef } from "react";
import ModeToggler from "@/components/molecules/ModeToggler";
import { Logo } from "@/components/atoms/Logo";

interface HeaderProps {
  currentView?: "home" | "selection" | "play" | "kids";
  showLanguage?: boolean;
}

export function Header({ currentView, showLanguage = true }: HeaderProps) {
  const { language: currentLanguage, setLanguage: onLanguageChange } = useGameMode();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const mobileNavId = "mobile-navigation";

  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node | null;
      if (!target) return;
      if (mobilePanelRef.current && mobilePanelRef.current.contains(target)) return;
      if (toggleButtonRef.current && toggleButtonRef.current.contains(target)) return;
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
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Main">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className={cn("text-muted-foreground hover:text-foreground", currentView === "home" && "text-foreground bg-accent")}
            >
              Home
            </Button>
          </Link>
          <Link to="/games">
            <Button
              variant="ghost"
              size="sm"
              className={cn("text-muted-foreground hover:text-foreground", currentView === "selection" && "text-foreground bg-accent")}
            >
              Games
            </Button>
          </Link>
          {/* FIX: Add Kids Section Link */}
          <Link to="/kids-games">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-muted-foreground hover:text-foreground flex items-center gap-1",
                currentView === "kids" && "text-foreground bg-accent"
              )}
            >
              <ToyBrick className="w-4 h-4 text-green-500" />
              Kids
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Help
          </Button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
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
          <div className="hidden sm:block">
            <ModeToggler />
          </div>
          <div className="sm:hidden">
            <ModeToggler compact />
          </div>
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

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          id={mobileNavId}
          ref={mobilePanelRef}
          className="sm:hidden border-t border-border/40 bg-background/95"
        >
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block">
              <Button variant="ghost" size="sm" className={cn("w-full justify-start", currentView === "home" && "bg-accent")}>
                Home
              </Button>
            </Link>
            <Link to="/games" onClick={() => setMobileOpen(false)} className="block">
              <Button variant="ghost" size="sm" className={cn("w-full justify-start", currentView === "selection" && "bg-accent")}>
                Games
              </Button>
            </Link>
            {/* FIX: Add Kids Section Link to Mobile Menu */}
            <Link to="/kids-games" onClick={() => setMobileOpen(false)} className="block">
              <Button variant="ghost" size="sm" className={cn("w-full justify-start flex items-center gap-2", currentView === "kids" && "bg-accent")}>
                <ToyBrick className="w-4 h-4 text-green-500" />
                Kids
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setMobileOpen(false)}>
              Help
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;