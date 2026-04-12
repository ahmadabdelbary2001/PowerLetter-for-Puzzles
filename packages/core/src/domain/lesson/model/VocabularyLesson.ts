// Vocabulary Lesson domain model

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: 'en' | 'ar';
  pronunciation?: string;
  exampleSentence?: Record<'en' | 'ar', string>;
  imageUrl?: string;
}

export interface VocabularyLesson {
  id: string;
  type: 'vocabulary';
  title: Record<'en' | 'ar', string>;
  description?: Record<'en' | 'ar', string>;
  sourceLanguage: 'en' | 'ar';
  targetLanguage: 'en' | 'ar';
  items: VocabularyItem[];
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
}
