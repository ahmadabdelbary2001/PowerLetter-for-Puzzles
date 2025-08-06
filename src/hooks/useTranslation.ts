import { useGameMode } from '@/contexts/GameModeContext';

export const useTranslation = () => {
    const { language } = useGameMode();

    const texts = {
        en: {
            // Language Selector
            languageSelectorSubtitle: "Choose your preferred language to start your word puzzle adventure",
            english: "English",
            arabic: "Arabic",
            arabicNative: "العربية",
            englishDescription: "Play in English with Latin alphabet",
            arabicDescription: "Play in Arabic with Arabic alphabet",
            
            // Common
            back: "Back",
            level: "Level",
            difficulty: "Difficulty",
            easy: "easy",
            medium: "medium",
            hard: "hard",
            congrats: "Congratulations!",
            wrongAnswer: "Wrong answer! Try again.",
            remove: "Remove",
            clear: "Clear",
            hint: "Hint",
            check: "Check Answer",
            showSolution: "Show Solution",
            prev: "Previous",
            next: "Next",
            reset: "Reset",
            continue: "Continue",
            features: "Features",
            select: "Select",
            selected: "Selected",
            
            // Game Type Selector
            selectGame: "Choose Game Type",
            selectGameDesc: "Select the type of challenge you want to play",
            formationTitle: "Word Formation Challenge",
            formationDesc: "Find all possible words that can be formed from a given set of letters",
            categoryTitle: "Category Word Guess",
            categoryDesc: "Guess the correct word based on clues from various categories",
            clueTitle: "Clue-Driven Word Find",
            clueDesc: "Find the hidden word by unscrambling letters using the provided clue",
            available: "Available",
            comingSoon: "Coming Soon",
            unknown: "Unknown",
            playNow: "Play Now",
            formationFeatures: [
                "Multiple word discovery",
                "Progressive difficulty",
                "Bilingual support"
            ],
            categoryFeatures: [
                "Topic-based clues",
                "Multiple categories",
                "Educational content"
            ],
            clueFeatures: [
                "Scrambled letters",
                "Helpful clues",
                "Hint system"
            ],
            moreGames: "More games and features coming soon! Stay tuned for updates.",
            
            // Game Mode Selector
            selectMode: "Choose Game Mode",
            selectModeDesc: "How would you like to play today?",
            singlePlayer: "Single Player",
            singlePlayerDesc: "Play solo and challenge yourself",
            competitive: "Competitive",
            competitiveDesc: "Play with friends in teams",
            singleFeatures: [
                "Personal progress",
                "Progressive challenges",
                "Hint system"
            ],
            competitiveFeatures: [
                "Multiple teams",
                "Scoring system",
                "Turn-based play"
            ],
            
            // Team Configurator
            teamSetup: "Team Setup",
            teamSetupDesc: "Configure teams for competitive play",
            numTeams: "Number of Teams",
            numTeamsDesc: "Choose the number of teams (2-8 teams)",
            teamNames: "Team Names",
            team: "Team"
        },
        ar: {
            // Language Selector
            languageSelectorSubtitle: "اختر لغتك المفضلة لبدء مغامرة ألغاز الكلمات",
            english: "الإنجليزية",
            arabic: "العربية",
            arabicNative: "العربية",
            englishDescription: "العب باللغة الإنجليزية مع الأبجدية اللاتينية",
            arabicDescription: "العب باللغة العربية مع الأبجدية العربية",
            
            // Common
            back: "رجوع",
            level: "المستوى",
            difficulty: "الصعوبة",
            easy: "سهل",
            medium: "متوسط",
            hard: "صعب",
            congrats: "مبروك!",
            wrongAnswer: "الإجابة خاطئة! حاول مرة أخرى.",
            remove: "حذف",
            clear: "مسح",
            hint: "تلميح",
            check: "تحقق من الإجابة",
            showSolution: "أظهر الحل",
            prev: "السابق",
            next: "التالي",
            reset: "إعادة",
            continue: "متابعة",
            features: "الميزات",
            select: "اختر",
            selected: "مختار",
            
            // Game Type Selector
            selectGame: "اختر نوع اللعبة",
            selectGameDesc: "اختر نوع التحدي الذي تريد أن تلعبه",
            formationTitle: "تحدي تكوين الكلمات",
            formationDesc: "اعثر على جميع الكلمات الممكنة من مجموعة من الحروف المعطاة",
            categoryTitle: "تخمين كلمة الفئة",
            categoryDesc: "خمن الكلمة الصحيحة بناءً على أدلة من فئات مختلفة",
            clueTitle: "البحث عن الكلمات بالأدلة",
            clueDesc: "اعثر على الكلمة المخفية عن طريق ترتيب الحروف باستخدام الدليل المقدم",
            available: "متاح",
            comingSoon: "قريباً",
            unknown: "غير معروف",
            playNow: "العب الآن",
            formationFeatures: [
                "اكتشاف كلمات متعددة",
                "صعوبة متدرجة",
                "دعم ثنائي اللغة"
            ],
            categoryFeatures: [
                "أدلة موضوعية",
                "فئات متعددة",
                "محتوى تعليمي"
            ],
            clueFeatures: [
                "حروف مبعثرة",
                "أدلة مفيدة",
                "نظام تلميحات"
            ],
            moreGames: "المزيد من الألعاب والمميزات قريباً! ابق متابعاً للتحديثات.",
            
            // Game Mode Selector
            selectMode: "اختر نمط اللعب",
            selectModeDesc: "كيف تريد أن تلعب اليوم؟",
            singlePlayer: "لاعب واحد",
            singlePlayerDesc: "العب بمفردك وتحدى نفسك",
            competitive: "تنافسي",
            competitiveDesc: "العب مع الأصدقاء في فرق",
            singleFeatures: [
                "تقدم شخصي",
                "تحديات متدرجة",
                "نظام تلميحات"
            ],
            competitiveFeatures: [
                "فرق متعددة",
                "نظام نقاط",
                "دوران الأدوار"
            ],

            // Team Configurator
            teamSetup: "إعداد الفرق",
            teamSetupDesc: "قم بإعداد الفرق للعب التنافسي",
            numTeams: "عدد الفرق",
            numTeamsDesc: "اختر عدد الفرق (2-8 فرق)",
            teamNames: "أسماء الفرق",
            team: "فريق"
        }
    } as const;

    const t = language === 'ar' ? texts.ar : texts.en;
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    
    return { t, dir };
};