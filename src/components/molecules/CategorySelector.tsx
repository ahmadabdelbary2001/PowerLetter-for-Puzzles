// src/components/molecules/CategorySelector.tsx
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { GameCategory } from "@/types/game";

interface CategoryData {
  id: GameCategory;
  icon: React.ReactNode;
  labelKey: string;
}

interface CategorySelectorProps {
  categories: CategoryData[];
  selectedCategories: GameCategory[];
  onCategoryToggle: (category: GameCategory) => void;
  className?: string;
}

export function CategorySelector({ 
  categories, 
  selectedCategories, 
  onCategoryToggle,
  className 
}: CategorySelectorProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6", className)}>
      {categories.map(cat => {
        const isSelected = selectedCategories.includes(cat.id);
        return (
          <Card
            key={cat.id}
            onClick={() => onCategoryToggle(cat.id)}
            className={cn(
              "text-center p-4 cursor-pointer hover:shadow-xl transition-all duration-300 relative",
              isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
            <div className="text-gray-700 dark:text-gray-300">{cat.icon}</div>
            <p className="mt-2 font-semibold text-sm sm:text-base">{t[cat.labelKey as keyof typeof t]}</p>
          </Card>
        );
      })}
    </div>
  );
}
