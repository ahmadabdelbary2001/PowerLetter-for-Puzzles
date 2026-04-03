import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
