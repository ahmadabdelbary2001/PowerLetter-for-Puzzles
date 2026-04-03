export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="text-center space-y-6 px-4">
        {/* Logo / Icon */}
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl">
          <span className="text-4xl">🧩</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold tracking-tight">
          PowerLetter
          <span className="block text-2xl font-normal text-purple-300 mt-2">
            for Puzzles
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
          A multilingual puzzle &amp; learning platform. Play games, follow
          learning paths, and explore lessons in Arabic &amp; English.
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          Web App — Phase 1 Complete ✅
        </div>

        {/* Links */}
        <div className="flex gap-4 justify-center pt-4 flex-wrap">
          <a
            href="/games"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors font-medium"
          >
            Browse Games →
          </a>
          <a
            href="/lessons"
            className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors font-medium"
          >
            Lessons →
          </a>
        </div>
      </div>
    </main>
  );
}
