// src/components/molecules/LanguageSelector.tsx
/**
 * LanguageSelector - A dropdown component for selecting the application language
 * 
 * This component provides a dropdown menu for users to select their preferred language.
 * It supports both compact and full display modes, and is accessible with keyboard
 * navigation and screen reader support.
 */
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Language } from "@/types/game";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  compact?: boolean;
}

const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  compact = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setIsOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
      if (e.key === "ArrowDown" && isOpen) {
        const firstBtn = containerRef.current?.querySelector("button[role='option']");
        (firstBtn as HTMLElement | null)?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const currentLang = languages.find((l) => l.code === currentLanguage) || languages[0];

  const handleSelect = (code: Language) => {
    onLanguageChange(code);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Dropdown list
  const list = (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-0 mt-2 z-50 w-44 rounded-lg shadow-lg overflow-hidden border bg-white dark:bg-gray-800",
        compact ? "text-sm" : "text-base"
      )}
      role="listbox"
      aria-orientation="vertical"
    >
      <div className="py-1">
        {languages.map((lang) => {
          const selected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              role="option"
              aria-selected={selected}
              onClick={() => handleSelect(lang.code)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors",
                selected ? "bg-slate-100 dark:bg-gray-700 font-semibold" : "font-normal"
              )}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="truncate">{lang.name}</span>
              {selected && <span className="ml-auto text-xs text-indigo-600">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (compact) {
    return (
      <div className="relative inline-block">
        <Button
          variant="ghost"
          size="sm"
          ref={buttonRef}
          onClick={() => setIsOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="flex items-center gap-1 px-2"
        >
          <Globe className="w-4 h-4" />
          <span className="sr-only">Language</span>
          <span className="text-xs">{currentLang.code.toUpperCase()}</span>
        </Button>
        {isOpen && list}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        ref={buttonRef}
        onClick={() => setIsOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-2 px-3"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLang.name}</span>
        <span className="ml-1">{currentLang.flag}</span>
      </Button>

      {isOpen && <div className="sm:relative">{list}</div>}
    </div>
  );
}
