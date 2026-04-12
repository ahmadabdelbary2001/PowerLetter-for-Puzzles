import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface LessonDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LessonDetailProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Lesson — ${id}`, description: `Study the ${id} lesson.` };
}

export default async function LessonDetailPage({ params }: LessonDetailProps) {
  const { id } = await params;
  // TODO: load lesson from lessonService.findById(id) and render LessonViewer organism

  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-4 text-3xl font-bold capitalize">{id.replace(/-/g, ' ')}</h1>
      {/* TODO: Replace with <LessonViewer lessonId={id} /> */}
      <p className="text-muted-foreground">Loading lesson content…</p>
    </section>
  );
}
