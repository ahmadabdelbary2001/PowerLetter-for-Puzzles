// src/pages/HeroSection.tsx
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleStartPlaying = () => {
    navigate("/games");
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-10 md:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration: hidden on small screens to reduce noise */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none hidden sm:block" />
      <div className="absolute top-0 right-0 w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl opacity-18 animate-pulse-slow hidden md:block" />
      <div className="absolute bottom-0 left-0 w-56 h-56 md:w-72 md:h-72 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full filter blur-3xl opacity-18 animate-pulse-slow hidden md:block" />

      <div className="container mx-auto max-w-6xl">
        {/* mobile-first: single column, becomes 2 columns on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                🚀 {t.betaStatus}
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">PowerLetter</span>
                <br />
                <span className="text-foreground">{t.wordPuzzles}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                {t.heroDescription}
              </p>
            </div>

            {/* Features list: wrap properly on narrow screens */}
            <div className="space-y-2">
              {t.herofeatures.map((feature: string, index: number) => (
                <div key={index} className="flex flex-wrap items-baseline gap-3 text-foreground">
                  <span className="text-lg font-semibold">{feature.split(" ")[0]}</span>
                  <span className="text-sm text-muted-foreground">{feature.substring(feature.indexOf(" ") + 1)}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons: stack on mobile, inline on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleStartPlaying}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🎮 {t.startPlaying}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-lg px-6 py-3 border-primary/30 hover:bg-primary/10"
              >
                📚 {t.howToPlay}
              </Button>
            </div>

            {/* Stats: responsive layout */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="min-w-[90px] text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">{t.gameTypes}</div>
              </div>
              <div className="min-w-[90px] text-center">
                <div className="text-2xl sm:text-3xl font-bold text-secondary">2</div>
                <div className="text-sm text-muted-foreground">{t.languages}</div>
              </div>
              <div className="min-w-[90px] text-center">
                <div className="text-2xl sm:text-3xl font-bold text-warning">∞</div>
                <div className="text-sm text-muted-foreground">{t.learning}</div>
              </div>
            </div>
          </div>

          {/* Hero image: responsive heights and hidden extras on smaller viewports */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-card to-card-hover rounded-2xl p-6 sm:p-8 shadow-2xl animate-float">
              <div className="w-full h-48 sm:h-64 md:h-80 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">🧩</span>
              </div>

              {/* Floating elements: show on md+ only to avoid overlap on mobile */}
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground p-2 sm:p-3 rounded-full shadow-lg hidden md:flex items-center justify-center">
                ⚡
              </div>
              <div className="absolute -bottom-3 -left-3 bg-secondary text-secondary-foreground p-2 sm:p-3 rounded-full shadow-lg hidden md:flex items-center justify-center">
                🧩
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
