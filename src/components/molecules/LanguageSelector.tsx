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

/**
 * Props for the LanguageSelector component
 */
interface LanguageSelectorProps {
  /** The currently selected language */
  currentLanguage: Language;
  /** Callback function when a language is selected */
  onLanguageChange: (language: Language) => void;
  /** Whether to display in compact mode (smaller button) */
  compact?: boolean;
}

/**
 * Available languages with their display names and flag emojis
 */
const languages: Array<{ code: Language; name: string; flag: string }> = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

/**
 * LanguageSelector component - A dropdown for language selection
 * 
 * This component renders a dropdown button that shows the current language
 * and allows users to select from available languages. It has two display modes:
 * compact (shows only language code) and full (shows language name and flag).
 * The component is accessible, supporting keyboard navigation and screen readers.
 */
export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  compact = false,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Handles language selection from the dropdown
   * @param language - The selected language code
   */
  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  /**
   * Effect to handle clicks outside the component to close the dropdown
   */
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  /**
   * Effect to handle Escape key to close the dropdown
   */
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

  /**
   * Dropdown list component - right-aligned on desktop, full-width on small screens
   */
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

  // Compact mode display
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

  // Default (desktop) display: show full name and flag, but compact visually on small screens
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