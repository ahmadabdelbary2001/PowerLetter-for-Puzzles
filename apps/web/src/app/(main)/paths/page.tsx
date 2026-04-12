import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: 'Follow structured learning paths to master Arabic or English step by step.',
};

export default function PathsPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Learning Paths</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* TODO: Render PathTree or PathCard organisms from pathService */}
        <div className="rounded-2xl border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-2">Arabic Foundations</h2>
          <p className="text-muted-foreground mb-4">Master the basics of the Arabic alphabet and common phrases.</p>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[30%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">30% Complete</p>
        </div>
        
        <div className="rounded-2xl border bg-card p-8 shadow-sm opacity-60">
          <h2 className="text-xl font-semibold mb-2">English Mastery</h2>
          <p className="text-muted-foreground mb-4">Advance your English vocabulary through immersive puzzles.</p>
          <div className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold">Locked</div>
        </div>
      </div>
    </section>
  );
}
