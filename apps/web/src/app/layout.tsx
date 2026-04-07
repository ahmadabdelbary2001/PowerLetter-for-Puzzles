import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "../components/I18nProvider";
import { ThemeProvider, TooltipProvider, Toaster, Sonner } from "@powerletter/ui";
import { NextRouterAdapter } from "../components/NextRouterAdapter";
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
              <NextRouterAdapter>
                <div className="relative flex min-h-screen flex-col">
                  <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                    {children}
                  </Suspense>
                </div>
                <Toaster />
                <Sonner />
              </NextRouterAdapter>
            </TooltipProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
