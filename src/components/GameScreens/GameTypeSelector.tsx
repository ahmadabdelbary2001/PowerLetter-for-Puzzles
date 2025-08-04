import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Puzzle, BookOpen, Search, Lock } from 'lucide-react';
import { useGameMode } from '../../contexts/GameModeContext';
import type { GameType as GameModeType } from '@/contexts/GameModeContext';

interface GameType {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  status: 'available' | 'coming_soon' | string;
  features: string[];
}

interface GameTypeSelectorProps {
  onGameTypeSelect: (typeId: GameModeType) => void;
  onBack: () => void;
}

const GameTypeSelector: React.FC<GameTypeSelectorProps> = ({ onGameTypeSelect, onBack }) => {
  const { gameType, setGameType, isRTL } = useGameMode();

  const gameTypes: GameType[] = [
    {
      id: 'formation',
      title: isRTL ? 'تحدي تكوين الكلمات' : 'Word Formation Challenge',
      description: isRTL
        ? 'اعثر على جميع الكلمات الممكنة من مجموعة من الحروف المعطاة'
        : 'Find all possible words that can be formed from a given set of letters',
      icon: <Puzzle className="w-8 h-8" />,
      status: 'coming_soon',
      features: [
        isRTL ? 'اكتشاف كلمات متعددة' : 'Multiple word discovery',
        isRTL ? 'صعوبة متدرجة' : 'Progressive difficulty',
        isRTL ? 'دعم ثنائي اللغة' : 'Bilingual support',
      ],
    },
    {
      id: 'category',
      title: isRTL ? 'تخمين كلمة الفئة' : 'Category Word Guess',
      description: isRTL
        ? 'خمن الكلمة الصحيحة بناءً على أدلة من فئات مختلفة'
        : 'Guess the correct word based on clues from various categories',
      icon: <BookOpen className="w-8 h-8" />,
      status: 'coming_soon',
      features: [
        isRTL ? 'أدلة موضوعية' : 'Topic-based clues',
        isRTL ? 'فئات متعددة' : 'Multiple categories',
        isRTL ? 'محتوى تعليمي' : 'Educational content',
      ],
    },
    {
      id: 'clue',
      title: isRTL ? 'البحث عن الكلمات بالأدلة' : 'Clue-Driven Word Find',
      description: isRTL
        ? 'اعثر على الكلمة المخفية عن طريق ترتيب الحروف باستخدام الدليل المقدم'
        : 'Find the hidden word by unscrambling letters using the provided clue',
      icon: <Search className="w-8 h-8" />,
      status: 'available',
      features: [
        isRTL ? 'حروف مبعثرة' : 'Scrambled letters',
        isRTL ? 'أدلة مفيدة' : 'Helpful clues',
        isRTL ? 'نظام تلميحات' : 'Hint system',
      ],
    },
  ];

  const getStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            {isRTL ? 'متاح' : 'Available'}
          </Badge>
        );
      case 'coming_soon':
        return (
          <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600 text-white">
            {isRTL ? 'قريباً' : 'Coming Soon'}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {isRTL ? 'غير معروف' : 'Unknown'}
          </Badge>
        );
    }
  };

  const handleGameTypeSelect = (typeId: GameModeType): void => {
    setGameType(typeId);
    onGameTypeSelect(typeId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {isRTL ? 'اختر نوع اللعبة' : 'Choose Game Type'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isRTL
              ? 'اختر نوع التحدي الذي تريد أن تلعبه'
              : 'Select the type of challenge you want to play'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {gameTypes.map((type) => (
            <Card
              key={type.id}
              className={`
                relative transition-all duration-300 hover:shadow-lg
                ${type.status === 'available'
                  ? 'hover:scale-105 cursor-pointer border-blue-200'
                  : 'opacity-75'
                }
                ${gameType === type.id && type.status === 'available'
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : ''
                }
              `}
              onClick={() => type.status === 'available' && handleGameTypeSelect(type.id as GameModeType)}
            >
              <CardHeader className={`text-center pb-4 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex ${isRTL ? 'justify-end' : 'justify-center'} mb-4 text-blue-600 dark:text-blue-400`}>
                  {type.icon}
                </div>
                <div className={`flex ${isRTL ? 'justify-between flex-row-reverse' : 'justify-between'} items-start mb-2`}>
                  <CardTitle className={`text-lg font-semibold flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {type.title}
                  </CardTitle>
                  {getStatusBadge(type.status)}
                </div>
                <CardDescription className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {type.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className={`font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                      {isRTL ? 'المميزات:' : 'Features:'}
                    </h4>
                    <ul className={`text-xs text-gray-600 dark:text-gray-400 space-y-1 ${isRTL ? 'text-right' : ''}`}>
                      {type.features.map((feature, index) => (
                        <li key={index} className={`flex items-center ${isRTL ? 'justify-end' : ''}`}>
                          <span className={`w-1.5 h-1.5 bg-blue-400 rounded-full ${isRTL ? 'ml-2' : 'mr-2'}`}></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => onGameTypeSelect(gameType as GameModeType)}
                    disabled={type.status !== 'available'}
                    variant={type.status === 'available' ? 'default' : 'secondary'}
                  >
                    {type.status === 'available' ? (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        {isRTL ? 'العب الآن' : 'Play Now'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        {isRTL ? 'قريباً' : 'Coming Soon'}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            {isRTL ? 'رجوع' : 'Back'}
          </Button>

          {gameType && (
            <Button
              onClick={() => onGameTypeSelect(gameType)}
              className="flex items-center gap-2"
              disabled={gameTypes.find((t) => t.id === gameType)?.status !== 'available'}
            >
              {isRTL ? 'متابعة' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          <p>
            {isRTL
              ? 'المزيد من الألعاب والمميزات قريباً! ابق متابعاً للتحديثات.'
              : 'More games and features coming soon! Stay tuned for updates.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameTypeSelector;
