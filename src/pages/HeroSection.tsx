import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTranslation } from "../hooks/useTranslation";

interface HeroSectionProps {
  onStartPlaying: () => void;
}

export default function HeroSection({ onStartPlaying }: HeroSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 md:py-20 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-br from-secondary/10 to-primary/10 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                🚀 {t.betaStatus}
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">PowerLetter</span>
                <br />
                <span className="text-foreground">{t.wordPuzzles}</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                {t.heroDescription} 

              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3">
              {t.herofeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-foreground">
                  <span className="text-lg">{feature.split(' ')[0]}</span>
                  <span className="text-sm">{feature.substring(feature.indexOf(' ') + 1)}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={onStartPlaying}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🎮 {t.startPlaying}
              </Button>

              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-3 border-primary/30 hover:bg-primary/10"
              >
                📚 {t.howToPlay}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">5+</div>
                <div className="text-sm text-muted-foreground">{t.gameTypes}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">2</div>
                <div className="text-sm text-muted-foreground">{t.languages}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">∞</div>
                <div className="text-sm text-muted-foreground">{t.learning}</div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-card to-card-hover rounded-2xl p-8 shadow-2xl animate-float">
              {/* Placeholder for hero image */}
              <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-4xl">🧩</span>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-lg animate-pulse">
                ⚡
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-3 rounded-full shadow-lg animate-bounce">
                🧩
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
