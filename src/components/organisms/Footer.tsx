// src/components/organisms/Footer.tsx
/**
 * Footer component for the PowerLetter application
 * Displays company information, quick links, contact details, and copyright information
 * Includes social media links and support status indicator
 */
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t('aboutUs', { ns: 'footer' }), href: "#" },
    { name: t('privacyPolicy', { ns: 'footer' }), href: "#" },
    { name: t('termsOfService', { ns: 'footer' }), href: "#" },
    { name: t('faq', { ns: 'footer' }), href: "#" },
  ];

  const socialLinks = ["twitter", "facebook", "instagram"];

  return (
    <footer className="site-footer bg-background/95 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold gradient-gold text-transparent bg-clip-text">⚡</div>
              <h3 className="text-lg sm:text-xl font-bold gradient-gold text-transparent bg-clip-text">PowerLetter</h3>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t('description', { ns: 'footer' })}
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  aria-label={t('followUs', { ns: 'footer', social })}
                >
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center hover:bg-primary/10 transition-colors">
                    <div className="w-4 h-4 gradient-gold rounded-sm opacity-70" />
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('quickLinks', { ns: 'footer' })}</h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-1 group">
                    <span>{link.name}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('contact', { ns: 'footer' })}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-muted-foreground">support@powerletter.com</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-muted-foreground">+1 (123) 456-7890</span>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full gradient-gold/10 text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>{t('availableForSupport', { ns: 'footer' })}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>{t('copyright', { ns: 'footer', year: new Date().getFullYear() })}</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 gradient-gold rounded-full"></div>
              <span>{t('version', { ns: 'footer' })} 1.0.0</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span>{t('madeWith', { ns: 'footer' })}</span>
              <span className="text-red-500">❤️</span>
              <span>{t('byTeam', { ns: 'footer' })}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
