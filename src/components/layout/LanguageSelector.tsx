import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Language } from "@/types/game";

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

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const currentLang = languages.find((lang) => lang.code === currentLanguage);

  // Dropdown list: right-aligned on desktop, full-width on small screens
  const list = (
    <div
      ref={containerRef}
      className={`absolute right-0 mt-2 ${compact ? "w-40" : "w-48 sm:w-48"} bg-background border rounded-md shadow-lg z-50`}
      role="listbox"
      aria-orientation="vertical"
      aria-activedescendant={currentLanguage}
      tabIndex={-1}
    >
      <div className="py-1">
        {languages.map((lang) => {
          const selected = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              role="option"
              aria-selected={selected}
              className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-muted ${selected ? "bg-muted/50 font-semibold" : ""}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span>{lang.flag}</span>
              <span className="truncate">{lang.name}</span>
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
          onClick={() => setIsOpen((s) => !s)}
          className="flex items-center gap-1 px-2"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          ref={buttonRef}
        >
          <Globe className="w-4 h-4" />
          <span className="sr-only">Language</span>
          <span className="text-xs">{currentLang?.code.toUpperCase()}</span>
        </Button>
        {/* on mobile the list is small/compact */}
        {isOpen && list}
      </div>
    );
  }

  // default (desktop): show full name and flag, but compact visually on small screens
  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        onClick={() => setIsOpen((s) => !s)}
        className="flex items-center gap-2 px-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        ref={buttonRef}
      >
        <Globe className="w-4 h-4" />
        <span className="mr-2 hidden sm:inline">{currentLang?.name}</span>
        <span>{currentLang?.flag}</span>
      </Button>

      {isOpen && (
        // wrap on small viewport to make the list easier to tap — make the parent relative so this can be positioned properly
        <div className="sm:relative">
          {list}
        </div>
      )}
    </div>
  );
}
