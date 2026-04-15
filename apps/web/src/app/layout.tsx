import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/shared/lib/I18nProvider";
import { ThemeProvider, TooltipProvider, Toaster, Sonner } from "@powerletter/ui";
import { NextRouterAdapter } from "@/shared/lib/NextRouterAdapter";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "PowerLetter for Puzzles",
  description:
    "A multilingual (Arabic/English) puzzle and learning platform — games, lessons, and learning paths.",
  keywords: ["puzzles", "games", "learning", "Arabic", "kids", "education"],
  authors: [{ name: "Ahmad Abdelbary" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen font-sans antialiased">
        <I18nProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <NextRouterAdapter>
                  <div className="relative flex min-h-screen flex-col">
                    {children}
                  </div>
                  <Toaster />
                  <Sonner />
                </NextRouterAdapter>
              </Suspense>
            </TooltipProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
