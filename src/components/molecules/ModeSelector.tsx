// src/components/molecules/ModeSelector.tsx
import { Card, CardTitle } from '@/components/ui/card';
import { User, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ModeSelectorProps {
  onSelect: (mode: 'single' | 'competitive') => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{t.selectMode}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card onClick={() => onSelect('single')} className="text-center p-6 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 hover:shadow-xl">
          <User className="mx-auto text-blue-500 mb-4" size={64} />
          <CardTitle className="text-xl font-semibold">{t.singlePlayer}</CardTitle>
        </Card>
        <Card onClick={() => onSelect('competitive')} className="text-center p-6 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300 hover:shadow-xl">
          <Users className="mx-auto text-green-500 mb-4" size={64} />
          <CardTitle className="text-xl font-semibold">{t.competitive}</CardTitle>
        </Card>
      </div>
    </>
  );
}
