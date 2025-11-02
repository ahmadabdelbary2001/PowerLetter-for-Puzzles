// src/features/picture-choice-game/instructions.ts
import { useTranslation } from 'react-i18next';
import en from '@/locales/en/instructions.json';
import ar from '@/locales/ar/instructions.json';

export function usePictureChoiceInstructions() {
  const { i18n } = useTranslation();
  const lang = (i18n.language ?? 'en').toLowerCase();
  return lang.startsWith('ar') ? ar.pictureChoice : en.pictureChoice;
}

export default usePictureChoiceInstructions;
