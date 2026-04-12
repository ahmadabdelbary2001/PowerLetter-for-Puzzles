import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn',
  description: 'Interactive learning view for the selected lesson.',
};

export default function LessonLearnPage() {
  return (
    <div className="relative min-h-screen">
      {/* TODO: Render LessonViewer organism in interactive mode */}
      <p className="flex h-screen items-center justify-center text-muted-foreground">
        Lesson viewer coming soon…
      </p>
    </div>
  );
}
