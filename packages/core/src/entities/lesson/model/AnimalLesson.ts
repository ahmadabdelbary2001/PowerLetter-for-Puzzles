// Animal Lesson domain model

export interface AnimalItem {
  id: string;
  nameEn: string;
  nameAr: string;
  imageUrl: string;
  category: 'mammal' | 'bird' | 'reptile' | 'fish' | 'insect' | 'other';
  habitat?: string;
  funFact?: Record<'en' | 'ar', string>;
}

export interface AnimalLesson {
  id: string;
  type: 'animals';
  title: Record<'en' | 'ar', string>;
  description?: Record<'en' | 'ar', string>;
  items: AnimalItem[];
  difficulty: 'easy' | 'medium' | 'hard';
}
