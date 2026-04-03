import { Button, Badge } from "@powerletter/ui";
import { Gamepad2, GraduationCap, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Background blobs for depth */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

      <div className="text-center space-y-8 px-4 relative z-10">
        {/* Logo / Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl animate-float">
          <span className="text-4xl text-white">⚡</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-300">
            <Sparkles className="w-3 h-3 mr-2" />
            Monorepo Powered
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              PowerLetter
            </span>
          </h1>
          <p className="text-xl font-medium text-purple-200">
            Multilingual Puzzles & Learning
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
          The same core game logic and UI system, now optimized for the web.
          Play in Arabic & English with seamless synchronization.
        </p>

        {/* Links */}
        <div className="flex gap-4 justify-center pt-6 flex-wrap">
          <Button size="lg" className="bg-purple-600 hover:bg-purple-500 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95">
            <Gamepad2 className="w-5 h-5 mr-3" />
            Browse Games
          </Button>
          <Button size="lg" variant="outline" className="rounded-xl border-slate-700 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
            <GraduationCap className="w-5 h-5 mr-3" />
            Start Lessons
          </Button>
        </div>

        {/* Status indicator */}
        <div className="pt-8 opacity-60 flex items-center justify-center gap-3 text-sm">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Next.js 15.3 + Tailwind 4.0
        </div>
      </div>
    </main>
  );
}
