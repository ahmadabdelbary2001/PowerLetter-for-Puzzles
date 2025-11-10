// src/components/organisms/Footer.tsx
/**
 * Footer component for the PowerLetter application
 * Displays company information, quick links, contact details, and copyright information
 * Includes social media links and support status indicator
 */
import { Link } from "react-router-dom";
import Logo from "@/components/atoms/Logo";
import { useTranslation } from "@/hooks/useTranslation";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { name: t("aboutUs", { ns: "footer" }), href: "#" },
    { name: t("privacyPolicy", { ns: "footer" }), href: "#" },
    { name: t("termsOfService", { ns: "footer" }), href: "#" },
    { name: t("faq", { ns: "footer" }), href: "#" },
  ];

  const social = [
    { id: "twitter", label: "Twitter", href: "#" },
    { id: "facebook", label: "Facebook", href: "#" },
    { id: "instagram", label: "Instagram", href: "#" },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/40 rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Logo showText showBadge={false} />
              <p className="text-sm text-muted-foreground max-w-xs">
                {t("description", { ns: "footer" })}
              </p>

              <div className="flex items-center gap-3">
                {social.map((s) => (
                  <Link
                    key={s.id}
                    to={s.href}
                    aria-label={s.label}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-700/30 transition-colors"
                  >
                    {/* simple decorative square as an icon placeholder */}
                    <div className="w-4 h-4 rounded-sm bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="text-sm font-semibold mb-4">{t("quickLinks", { ns: "footer" })}</h4>
              <ul className="space-y-3 text-sm">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & support */}
            <div>
              <h4 className="text-sm font-semibold mb-4">{t("contact", { ns: "footer" })}</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-700/20">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">support@powerletter.com</div>
                    <div className="text-xs text-muted-foreground/80">24/7 support</div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-700/20">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  </div>
                  <div>
                    <div className="text-muted-foreground">+1 (123) 456-7890</div>
                    <div className="text-xs text-muted-foreground/80">{t("availableForSupport", { ns: "footer" })}</div>
                  </div>
                </li>

                <li className="pt-2">
                  <Badge variant="subtle" size="sm" className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
                    <span className="text-xs">{t("availableForSupport", { ns: "footer" })}</span>
                  </Badge>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-slate-700/40 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>
              {t("copyright", {
                ns: "footer",
                year: new Date().getFullYear(),
              })}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs">
                <span>{t("version", { ns: "footer" })}</span>
                <span className="font-mono text-xs">1.0.0</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span>{t("madeWith", { ns: "footer" })}</span>
                <span aria-hidden className="text-rose-500">♥</span>
                <span>{t("byTeam", { ns: "footer" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
