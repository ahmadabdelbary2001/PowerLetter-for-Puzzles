import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <Globe className="w-14 h-14 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Power<span className="text-blue-600 dark:text-blue-400">Letter</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Choose your preferred language to start your word puzzle adventure
            </p>
          </div>
        </div>
        
        {/* Language Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {languages.map((lang) => (
            <Card 
              key={lang.code}
              className={`
                cursor-pointer transition-all duration-300 
                ${language === lang.code 
                  ? 'ring-2 ring-blue-500 border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }
              `}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-6xl mb-4">{lang.flag}</div>
                <CardTitle className={`text-3xl font-bold ${lang.code === 'ar' ? 'font-arabic' : ''}`}>
                  {lang.nativeName}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className={`text-center text-gray-500 dark:text-gray-400 mb-4 text-lg ${lang.code === 'ar' ? 'font-arabic' : ''}`}>
                  {lang.name}
                </div>
                
                <p className={`
                  text-center text-gray-600 dark:text-gray-300 mb-6
                  ${lang.code === 'ar' ? 'text-right font-arabic' : ''}
                `}>
                  {lang.description}
                </p>
                
                <Button 
                  className="w-full py-6 text-base font-medium"
                  variant={language === lang.code ? "default" : "outline"}
                >
                  {language === lang.code ? (
                    <div className="flex items-center justify-center">
                      <span>{lang.code === 'ar' ? 'مختار' : 'Selected'}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
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
              className="px-10 py-6 text-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center">
                <span>{language === 'ar' ? 'متابعة' : 'Continue'}</span>
                <ArrowRight className="w-5 h-5 ml-3" />
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;