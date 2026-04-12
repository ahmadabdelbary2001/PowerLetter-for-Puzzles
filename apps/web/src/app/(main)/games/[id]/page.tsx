import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Game — ${id}`,
    description: `Details and settings for the ${id} game.`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;

  // TODO: Validate id against GameRegistry and redirect / notFound
  const validIds = [
    'phrase-clue', 'formation', 'letter-flow', 'outside-the-story',
    'image-clue', 'img-choice', 'word-choice',
  ];

  if (!validIds.includes(id)) notFound();

  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-4 text-3xl font-bold capitalize">{id.replace(/-/g, ' ')}</h1>
      <p className="text-muted-foreground mb-8">
        Configure your game settings and start playing.
      </p>
      {/* TODO: Render GameSettingsPanel with game-specific config */}
    </section>
  );
}
