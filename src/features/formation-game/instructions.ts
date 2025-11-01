// src/features/formation-game/instructions.ts

import { useTranslation } from "react-i18next";
import en from "@/locales/en/instructions.json";
import ar from "@/locales/ar/instructions.json";

export function useFormationInstructions() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.toLowerCase();
  const instructions = lang.startsWith("ar") ? ar.formation : en.formation;

  return instructions;
}
