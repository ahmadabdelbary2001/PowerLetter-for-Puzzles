import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Globe, ArrowRight } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
}

interface LanguageSelectorProps {
  onLanguageSelect: (langCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect }) => {
  const [language, setLanguage] = useState<string>('');

  const languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      description: 'Play in English with Latin alphabet'
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      description: 'العب باللغة العربية مع الأبجدية العربية'
    }
  ];

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white">
              Power<span className="text-blue-600 dark:text-blue-400">Letter</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose your preferred language to start your word puzzle adventure
          </p>
        </div>
        
        {/* Language Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {languages.map((lang) => (
            <Card 
              key={lang.code}
              className={`
                cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
                ${language === lang.code 
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">{lang.flag}</div>
                <CardTitle className={`text-2xl ${lang.code === 'ar' ? 'font-arabic' : ''}`}>
                  {lang.nativeName}
                </CardTitle>
                <CardDescription className="text-lg">
                  {lang.name}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className={`
                  text-center text-gray-600 dark:text-gray-300 mb-4
                  ${lang.code === 'ar' ? 'text-right font-arabic' : ''}
                `}>
                  {lang.description}
                </p>
                
                <Button 
                  className="w-full"
                  variant={language === lang.code ? "default" : "outline"}
                >
                  {language === lang.code ? (
                    <>
                      <span>{lang.code === 'ar' ? 'مختار' : 'Selected'}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <span>{lang.code === 'ar' ? 'اختر' : 'Select'}</span>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Continue Button */}
        {language && (
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => onLanguageSelect(language)}
              className="px-8 py-3 text-lg"
            >
              {language === 'ar' ? 'متابعة' : 'Continue'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;