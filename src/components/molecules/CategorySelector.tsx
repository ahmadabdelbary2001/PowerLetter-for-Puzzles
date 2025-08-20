// src/components/molecules/CategorySelector.tsx
/**
 * CategorySelector - A component for selecting game categories
 * 
 * This component displays a grid of category cards that users can select or deselect.
 * It's used in the game setup process to allow players to choose which categories
 * of questions they want to play with.
 */
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { GameCategory } from "@/types/game";

/**
 * Data structure for a game category
 */
interface CategoryData {
  /** Unique identifier for the category */
  id: GameCategory;
  /** Icon to display for the category */
  icon: React.ReactNode;
  /** Translation key for the category label */
  labelKey: string;
}

/**
 * Props for the CategorySelector component
 */
interface CategorySelectorProps {
  /** Array of available categories */
  categories: CategoryData[];
  /** Array of currently selected categories */
  selectedCategories: GameCategory[];
  /** Callback function when a category is toggled */
  onCategoryToggle: (category: GameCategory) => void;
  /** Additional CSS classes for custom styling */
  className?: string;
}

/**
 * CategorySelector component - A grid of selectable category cards
 * 
 * This component renders a responsive grid of category cards. Each card displays
 * an icon and a translated label. Selected categories are highlighted with a blue
 * ring and background, and show a checkmark. Users can click on cards to select
 * or deselect categories.
 */
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
            {/* Checkmark indicator for selected categories */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}
            {/* Category icon */}
            <div className="text-gray-700 dark:text-gray-300">{cat.icon}</div>
            {/* Category label (translated) */}
            <p className="mt-2 font-semibold text-sm sm:text-base">{t[cat.labelKey as keyof typeof t]}</p>
          </Card>
        );
      })}
    </div>
  );
}