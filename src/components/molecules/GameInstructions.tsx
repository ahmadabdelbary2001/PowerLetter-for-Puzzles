// src/components/molecules/GameInstructions.tsx

import React, { useState } from 'react';
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GameInstructionsProps {
  instructions: {
    title: string;
    description: string;
    steps: string[];
  };
  trigger?: React.ReactNode;
}

/**
 * GameInstructions component - Displays game instructions in a modal
 * Used across all games to provide consistent how-to-play experience
 */
const GameInstructions: React.FC<GameInstructionsProps> = ({ instructions, trigger }) => {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir(); // 'ltr' or 'rtl' for the active language;
  const [open, setOpen] = useState(false);
  const isArabic = dir === 'rtl';

  const defaultTrigger = (
    <Button variant="ghost" size="icon" className={`h-8 w-8 p-0 ${isArabic ? 'text-right' : 'text-left'}`} onClick={() => setOpen(true)}>
      <span className="sr-only">{t.howToPlay}</span>
      <span className={`font-bold text-lg ${isArabic ? 'mr-1' : 'ml-1'}`}>{isArabic ? '؟' : '?'}</span>
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className={`${isArabic ? 'text-right' : 'text-left'}`}>
        <DialogHeader>
          <DialogTitle className={`${isArabic ? 'text-right' : 'text-left'}`} >
            {t.howToPlay}: {instructions.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300" dir={isArabic ? 'rtl' : 'ltr'}>{instructions.description}</p>
          <div>
            <h3 className={`font-medium mb-2 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>{t.gameplaySteps}</h3>
            <ol className={`list-decimal ${isArabic ? 'list-inside pr-5' : 'list-inside pl-5'} space-y-1 text-right ${isArabic ? 'rtl' : 'ltr'}`}>
              {instructions.steps.map((step, index) => (
                <li key={index} className={`text-gray-700 dark:text-gray-300 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameInstructions;