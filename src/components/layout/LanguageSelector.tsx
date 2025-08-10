// src/components/common/LanguageSelector.tsx
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
    // return focus to the trigger for keyboard users
    buttonRef.current?.focus();
  };

  // close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // close on Escape and handle basic keyboard nav
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

  const list = (
    <div
      ref={containerRef}
      className="absolute right-0 mt-2 w-48 bg-background border rounded-md shadow-lg z-50"
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
              className={`flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-muted ${
                selected ? "bg-muted/50 font-semibold" : ""
              }`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
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
          className="flex items-center gap-1"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <Globe className="w-4 h-4" />
          <span>{currentLang?.code.toUpperCase()}</span>
        </Button>

        {isOpen && list}
      </div>
    );
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        onClick={() => setIsOpen((s) => !s)}
        className="flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="mr-2">{currentLang?.name}</span>
        <span>{currentLang?.flag}</span>
      </Button>

      {isOpen && list}
    </div>
  );
}
