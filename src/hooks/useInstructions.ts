// src/hooks/useInstructions.ts
import { useMemo } from "react";
import { useTranslation as useI18next } from "react-i18next";

import en from "@/locales/en/instructions.json";
import ar from "@/locales/ar/instructions.json";

export type InstructionSet = {
  title: string;
  description?: string;
  steps?: string[];
};

export type InstructionKey =
  | "phraseClue"
  | "formation"
  | "imgClue"
  | "letterFlow"
  | "outsideStory"
  | "imgChoice"
  | "wordChoice";

/**
 * Generic hook to get instructions for a specific instruction key.
 * Falls back to English when the active language is not Arabic.
 */
export function useInstructions(key: InstructionKey): InstructionSet | null {
  const { i18n } = useI18next();
  const lang = (i18n.language ?? "en").toLowerCase();

  return useMemo(() => {
    const source = lang.startsWith("ar") ? (ar as Record<string, unknown>) : (en as Record<string, unknown>);
    const maybe = source[key] as unknown;
    if (!maybe || typeof maybe !== "object") return null;

    const data = maybe as Record<string, unknown>;
    const title = typeof data.title === "string" ? data.title : String(data.title ?? "");
    const description = typeof data.description === "string" ? data.description : undefined;
    const steps = Array.isArray(data.steps) ? (data.steps.filter((s) => typeof s === "string") as string[]) : undefined;

    return { title, description, steps };
  }, [key, lang]);
}

/* --- Convenience named hooks kept for backwards compatibility --- */

export function usePhraseClueInstructions(): InstructionSet | null {
  return useInstructions("phraseClue");
}

export function useFormationInstructions(): InstructionSet | null {
  return useInstructions("formation");
}

export function useImageClueInstructions(): InstructionSet | null {
  return useInstructions("imgClue");
}

export function useLetterFlowInstructions(): InstructionSet | null {
  return useInstructions("letterFlow");
}

export function useOutsideStoryInstructions(): InstructionSet | null {
  return useInstructions("outsideStory");
}

export function useImgChoiceInstructions(): InstructionSet | null {
  return useInstructions("imgChoice");
}

export function useWordChoiceInstructions(): InstructionSet | null {
  return useInstructions("wordChoice");
}

export default useInstructions;
