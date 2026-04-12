import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lessons',
  description: 'Explore lessons on animals, countries, and vocabulary in Arabic and English.',
};

export default function LessonsPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Lessons</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* TODO: Render LessonCard molecules fetched from LessonRegistry */}
        <div className="rounded-xl border p-6 text-center text-muted-foreground">
          Animals
        </div>
        <div className="rounded-xl border p-6 text-center text-muted-foreground">
          Countries
        </div>
        <div className="rounded-xl border p-6 text-center text-muted-foreground">
          Vocabulary
        </div>
      </div>
    </section>
  );
}
