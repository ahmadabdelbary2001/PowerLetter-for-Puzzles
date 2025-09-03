import { useGameMode } from '@/hooks/useGameMode';

export const useTranslation = () => {
    const { language } = useGameMode();

    const texts = {
        en: {
            // Language Selector
            languageSelectorSubtitle: "Choose your preferred language to start your word puzzle adventure",
            english: "English",
            arabic: "Arabic",
            arabicNative: "Arabic",
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
            wrongAttempts: "Wrong attempts",
            solutionWas: "The solution was",
            remove: "Remove",
            clear: "Clear",
            hint: "Hint",
            check: "Check Answer",
            showSolution: "Show Solution",
            undo: "Undo",
            typeAWord: "Type a word",
            hintUsed: "Hint used!",
            alreadyFound: "Already found!",
            found: "Found!",
            prev: "Previous",
            next: "Next",
            reset: "Reset",
            continue: "Continue",
            features: "Features",
            select: "Select",
            selected: "Selected",
            of: "of",

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
            // Add translations for Letter Flow Game
            letterFlowTitle: "Letter Flow",
            letterFlowDesc: "Connect matching letters to fill the grid and reveal the hidden word.",
            letterFlowFeatures: [
                "Spatial puzzle solving",
                "Fill the entire grid",
                "Combines logic and vocabulary"
            ],

            // translations for Kids Game section
            kidsGamesTitle: "Kids Puzzles",
            kidsGamesDesc: "Fun and educational games designed for children.",
            imageClueTitle: "Picture to Word",
            imageClueDesc: "Form the word that matches the picture from the given letters.",
            imageClueFeatures: ["Builds spelling skills", "Visual association", "Audio support"],

            wordChoiceTitle: "Find the Word",
            wordChoiceDesc: "Look at the picture and choose the correct word from a list.",
            wordChoiceFeatures: ["Improves reading", "Multiple choice", "Immediate feedback"],

            pictureChoiceTitle: "Find the Picture",
            pictureChoiceDesc: "Read the word and choose the picture that matches it.",
            pictureChoiceFeatures: ["Tests comprehension", "Visual recognition", "Fun and interactive"],

            // Puzzle descriptions
            pictureToWordTitle: "Picture to Word",
            pictureToWordDesc: "Form the word that matches the picture from the given letters.",
            pictureToWordFeatures: ["Builds spelling skills", "Visual association", "Audio support"],
            findTheWordTitle: "Find the Word",
            findTheWordDesc: "Look at the picture and choose the correct word from a list.",
            findTheWordFeatures: ["Improves reading", "Multiple choice", "Immediate feedback"],
            findThePictureTitle: "Find the Picture",
            findThePictureDesc: "Read the word and choose the picture that matches it.",
            findThePictureFeatures: ["Tests comprehension", "Visual recognition", "Fun and interactive"],

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

            selectCategory: "Select a Category",
            selectDifficulty: "Select Difficulty",
            selectCategoryDesc: "You can pick one or more topics, or choose 'General' to include them all.",
            animals: "Animals",
            science: "Science",
            geography: "Geography",
            generalKnowledge: "General",
            fruits: "Fruits",
            shapes: "Shapes",
            loading: "Loading",
            noLevelsFound: "No levels found for this selection.",

            // Team Configurator
            teamSetup: "Team Setup",
            teamSetupDesc: "Configure teams for competitive play",
            numTeams: "Number of Teams",
            numTeamsDesc: "Choose the number of teams (2-8 teams)",
            teamNames: "Team Names",
            team: "Team",
            hintsPerTeam: "Hints per Team",
            hintsPerTeamDesc: "Set how many hints each team can use for the entire game (shared across levels).",
            hints: "Hints",
            noHintsLeft: "No hints left for your team!",
            scoreboard: "Scoreboard",
            currentTurn: "Current Turn",
            points: "Points",

            // Hero Section
            betaStatus: "Now in Beta",
            wordPuzzles: "Word Puzzles",
            heroDescription: "Challenge your mind with our collection of educational word puzzle games. Master vocabulary in both Arabic and English through engaging gameplay.",
            startPlaying: "Start Playing Now",
            howToPlay: "How to Play",
            gameplaySteps: "Gameplay Steps:",
            gameTypes: "Game Types",
            languages: "Languages",
            learning: "Learning",
            herofeatures: [
                "🎯 Multiple game types with unique challenges",
                "🌍 Full Arabic and English support with RTL",
                "🧠 Educational focus with word meanings",
                "💡 Smart hint system to guide learning"
            ],
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
            wrongAttempts: "محاولات خاطئة",
            solutionWas: "كان الحل هو",
            remove: "حذف",
            clear: "مسح",
            hint: "تلميح",
            check: "تحقق من الإجابة",
            showSolution: "أظهر الحل",
            undo: "تراجع",
            typeAWord: "اكتب كلمة",
            hintUsed: "تم استخدام تلميح!",
            alreadyFound: "تم العثور عليها بالفعل!",
            found: "تم العثور على!",
            prev: "السابق",
            next: "التالي",
            reset: "إعادة",
            continue: "متابعة",
            features: "الميزات",
            select: "اختر",
            selected: "مختار",
            of: "من",

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
            // Add translations for Letter Flow Game
            moreGames: "المزيد من الألعاب والمميزات قريباً! ابق متابعاً للتحديثات.",
            letterFlowTitle: "مسار الحروف",
            letterFlowDesc: "صِل بين الحروف المتطابقة لملء الشبكة بالكامل وكشف الكلمة المخفية.",
            letterFlowFeatures: [
                "ألغاز منطقية ومكانية",
                "يجب ملء الشبكة بالكامل",
                "تجمع بين المنطق والمفردات"
            ],

            // translations for Kids Game section
            kidsGamesTitle: "ألغاز الأطفال",
            kidsGamesDesc: "ألعاب ممتعة وتعليمية مصممة خصيصاً للأطفال.",
            imageClueTitle: "صورة وكلمة",
            imageClueDesc: "كوّن الكلمة التي تطابق الصورة من الحروف المعطاة.",
            imageClueFeatures: ["تنمية مهارات الإملاء", "ربط بصري", "دعم صوتي"],

            wordChoiceTitle: "ابحث عن الكلمة",
            wordChoiceDesc: "انظر إلى الصورة واختر الكلمة الصحيحة من القائمة.",
            wordChoiceFeatures: ["تحسين القراءة", "اختيار من متعدد", "تقييم فوري"],

            pictureChoiceTitle: "ابحث عن الصورة",
            pictureChoiceDesc: "اقرأ الكلمة واختر الصورة التي تطابقها.",
            pictureChoiceFeatures: ["اختبار الفهم", "تمييز بصري", "ممتعة وتفاعلية"],

            // Puzzle descriptions
            pictureToWordTitle: "صورة وكلمة",
            pictureToWordDesc: "كوّن الكلمة التي تطابق الصورة من الحروف المعطاة.",
            pictureToWordFeatures: ["تنمية مهارات الإملاء", "ربط بصري", "دعم صوتي"],
            findTheWordTitle: "ابحث عن الكلمة",
            findTheWordDesc: "انظر إلى الصورة واختر الكلمة الصحيحة من القائمة.",
            findTheWordFeatures: ["تحسين القراءة", "اختيار من متعدد", "تقييم فوري"],
            findThePictureTitle: "ابحث عن الصورة",
            findThePictureDesc: "اقرأ الكلمة واختر الصورة التي تطابقها.",
            findThePictureFeatures: ["اختبار الفهم", "تمييز بصري", "ممتعة وتفاعلية"],

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

            selectCategory: "اختر فئة",
            selectDifficulty: "اختر الصعوبة",
            selectCategoryDesc: "يمكنك اختيار فئة أو أكثر، أو اختيار \"منوع\" لتشمل الكل.",
            animals: "حيوانات",
            science: "علوم",
            geography: "جغرافيا",
            generalKnowledge: "منوع",
            fruits: "فواكه",
            shapes: "أشكال",
            loading: "جاري التحميل",
            noLevelsFound: "لم يتم العثور على مستويات لهذا الاختيار.",

            // Team Configurator
            teamSetup: "إعداد الفرق",
            teamSetupDesc: "قم بإعداد الفرق للعب التنافسي",
            numTeams: "عدد الفرق",
            numTeamsDesc: "اختر عدد الفرق (2-8 فرق)",
            teamNames: "أسماء الفرق",
            team: "فريق",
            hintsPerTeam: "التلميحات لكل فريق",
            hintsPerTeamDesc: "حدد عدد التلميحات التي يمكن لكل فريق استخدامها طوال اللعبة (مشتركة على مستوى اللعب).",
            hints: "تلميحات",
            noHintsLeft: "لا توجد تلميحات متبقية لفريقك!",
            scoreboard: "لوحة النتائج",
            currentTurn: "الدور الحالي",
            points: "نقاط",

            // Hero Section
            betaStatus: "الآن في نسخة تجريبية",
            wordPuzzles: "ألغاز الكلمات",
            heroDescription: "تحدى عقلك مع مجموعتنا من ألغاز الكلمات التعليمية. أتقن المفردات في كل من العربية والإنجليزية من خلال لعبة جذابة.",
            startPlaying: "ابدأ اللعب الآن",
            howToPlay: "كيف تلعب",
            gameplaySteps: "خطوات اللعب:",
            gameTypes: "أنواع الألعاب",
            languages: "اللغات",
            learning: "التعلم",
            herofeatures: [
                "🎯 أنواع ألعاب متعددة مع تحديات فريدة",
                "🌍 دعم كامل للغة العربية والإنجليزية مع RTL",
                "🧠 تركيز تعليمي مع معاني الكلمات",
                "💡 نظام تلميحات ذكي لتوجيه التعلم"
            ],
        },
    } as const;

    const t = language === 'ar' ? texts.ar : texts.en;
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    
    return { t, dir };
};