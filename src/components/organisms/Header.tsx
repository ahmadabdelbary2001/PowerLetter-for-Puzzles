// src/components/organisms/Header.tsx
/**
 * Header component - The main navigation header for the PowerLetter application
 * Features responsive design with desktop and mobile navigation
 * Includes language selector, mode toggler, and navigation links
 * Refined mobile menu to be a modern, non-intrusive popover with smooth animations.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import ModeToggler from "@/components/molecules/ModeToggler";
import { cn } from "@/lib/utils";
import { useGameMode } from "@/hooks/useGameMode";
import { Menu, ToyBrick, Home, Gamepad2, HelpCircle } from "lucide-react";
import Logo from "@/components/atoms/Logo";
import { useTranslation } from "@/hooks/useTranslation";

interface HeaderProps {
  currentView?: "home" | "selection" | "play" | "kids";
  showLanguage?: boolean;
}

// --- IMPROVEMENT: Define navigation links in one place to avoid duplication ---
const navLinks = [
  { href: "/", view: "home", labelKey: "home", Icon: Home },
  { href: "/games", view: "selection", labelKey: "games", Icon: Gamepad2 },
  { href: "/kids-games", view: "kids", labelKey: "kids", Icon: ToyBrick },
  { href: "/help", view: "help", labelKey: "help", Icon: HelpCircle },
];

export function Header({ currentView, showLanguage = true }: HeaderProps) {
  const { language: currentLanguage, setLanguage: onLanguageChange } = useGameMode();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  // Effect for the mobile menu's enter animation
  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => setIsMounted(true));
    } else {
      setIsMounted(false);
    }
  }, [mobileOpen]);

  // Effect to handle closing the mobile menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!mobileOpen) return;

    const handleInteraction = (e: MouseEvent | TouchEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;

      const target = e.target as Node | null;
      if (
        !mobilePanelRef.current?.contains(target) &&
        !toggleButtonRef.current?.contains(target)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("touchstart", handleInteraction);
    document.addEventListener("keydown", handleInteraction);
    return () => {
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-1" role="navigation" aria-label="Main">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={currentView === link.view ? "secondary" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                {link.view === 'kids' && <ToyBrick className="h-4 w-4 text-green-500" />}
                {t(link.labelKey)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right-side Actions */}
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
          <ModeToggler />
          <div className="sm:hidden">
            <button
              ref={toggleButtonRef}
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setMobileOpen((s) => !s)}
              className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Popover Menu */}
      {mobileOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full z-50 flex justify-center pointer-events-none">
          <div
            ref={mobilePanelRef}
            id="mobile-navigation"
            role="dialog"
            className={cn(
              "pointer-events-auto mt-2 w-full max-w-xs mx-4 rounded-xl bg-background/95 backdrop-blur-md border shadow-lg overflow-hidden transform transition-all duration-200 ease-out",
              isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            )}
          >
            <div className="p-2 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className="block">
                  <Button
                    variant={currentView === link.view ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start gap-3"
                  >
                    <link.Icon className={cn("h-4 w-4", link.view === 'kids' && 'text-green-500')} />
                    {t(link.labelKey)}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
