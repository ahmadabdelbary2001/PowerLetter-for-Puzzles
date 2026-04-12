// Country Lesson domain model

export interface CountryItem {
  id: string;
  nameEn: string;
  nameAr: string;
  capital: Record<'en' | 'ar', string>;
  flagUrl: string;
  continent: 'africa' | 'asia' | 'europe' | 'americas' | 'oceania';
  currency?: string;
  funFact?: Record<'en' | 'ar', string>;
}

export interface CountryLesson {
  id: string;
  type: 'countries';
  title: Record<'en' | 'ar', string>;
  description?: Record<'en' | 'ar', string>;
  items: CountryItem[];
  difficulty: 'easy' | 'medium' | 'hard';
}
