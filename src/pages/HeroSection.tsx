// src/pages/HeroSection.tsx
/**
 * @description The main landing page component that combines the best elements from previous versions
 * with consistent styling from KidsGameSelector and GameTypeSelector pages.
 */
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";
import { Sparkles, Trophy, Lightbulb, Brain, Languages, Users, Gamepad2, ToyBrick } from "lucide-react";

interface HeroFeature {
  icon: string;
  title: string;
  description: string;
}

export default function HeroSection(): JSX.Element {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const navigate = useNavigate();

  const heroFeatures = t('herofeatures', { ns: 'landing', returnObjects: true }) as HeroFeature[];
  const stats = t('stats', { ns: 'landing', returnObjects: true }) as Array<{ value: string; label: string; icon: string }>;

  const handleStartPlaying = () => navigate("/games");
  const handleKidsGames = () => navigate("/kids-games");
  const handleHowToPlay = () => navigate("/help");

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated Background Elements - Consistent with Game Selection Pages */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:bg-blue-900/50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:bg-purple-900/50"></div>
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:bg-indigo-900/50"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24" dir={dir}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side: Enhanced Content */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 text-primary px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {t('betaStatus', { ns: 'landing' })}
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-300%">
                  PowerLetter
                </span>

                <br />

                <span className="text-slate-800 dark:text-white">
                  {t('wordPuzzles', { ns: 'landing' })}
                </span>
              </h1>

              <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('heroDescription', { ns: 'landing' })}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {t('heroAdditionalDescription', { ns: 'landing' })}
                </p>
              </div>
            </div>

            {/* Enhanced Features Grid - Consistent with Game Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {heroFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <span className="text-white text-lg">{feature.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons - Consistent with Game Selection */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Button
                onClick={handleStartPlaying}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-primary-foreground text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <Gamepad2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('startPlaying', { ns: 'landing' })}
              </Button>
              <Button
                onClick={handleKidsGames}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-3 rounded-xl border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-300 transform hover:scale-105 group"
              >
                <ToyBrick className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('kidsGames', { ns: 'landing' })}
              </Button>
              <Button
                onClick={handleHowToPlay}
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-lg px-8 py-3 rounded-xl text-muted-foreground hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 group"
              >
                <Lightbulb className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                {t('howToPlay', { ns: 'landing' })}
              </Button>
            </div>

            {/* Statistics - Enhanced with Icons */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-700">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-center mb-2">
                    {stat.icon === 'brain' && <Brain className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />}
                    {stat.icon === 'languages' && <Languages className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform duration-300" />}
                    {stat.icon === 'users' && <Users className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform duration-300" />}
                  </div>
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Interactive Game Preview - Now responsive */}
          <div className="relative lg:order-2 mt-12 lg:mt-0">
            <div className="relative bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-800/60 rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur-sm border border-white/20 animate-float">
              {/* Main Game Preview Container */}
              <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Floating Game Elements */}
                <div className="absolute top-4 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-blue-500 rounded-lg animate-bounce shadow-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">A</span>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 sm:w-14 sm:h-14 bg-green-500 rounded-lg animate-bounce shadow-lg animation-delay-1000 flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">ب</span>
                </div>
                <div className="absolute bottom-4 left-4 w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 rounded-lg animate-bounce shadow-lg animation-delay-2000 flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">Z</span>
                </div>
                <div className="absolute bottom-4 right-4 w-10 h-10 sm:w-14 sm:h-14 bg-purple-500 rounded-lg animate-bounce shadow-lg animation-delay-1500 flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg">ك</span>
                </div>

                {/* Central PowerLetter Icon */}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-4 animate-pulse-slow">
                    <span className="text-2xl sm:text-3xl text-white">⚡</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">PowerLetter</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{t('tagline', { ns: 'landing' })}</p>
                </div>
              </div>

              {/* Floating Achievement Badges */}
              <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 bg-gradient-to-r from-primary to-secondary text-white p-2 sm:p-3 rounded-full shadow-2xl flex items-center justify-center">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-2 sm:p-3 rounded-full shadow-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Platform Badges */}
              <div className="absolute -bottom-3 right-4 sm:right-8 flex gap-2">
                <div className="bg-white dark:bg-slate-800 px-2 py-1 sm:px-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-muted-foreground">
                  🎯 {t('educational', { ns: 'landing' })}
                </div>
                <div className="bg-white dark:bg-slate-800 px-2 py-1 sm:px-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-muted-foreground">
                  🌍 {t('bilingual', { ns: 'landing' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
