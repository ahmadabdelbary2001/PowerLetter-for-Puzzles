import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GAME_REGISTRY } from '@powerletter/ui';
import { GameSettingsPage } from '@powerletter/ui';

interface GameDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return GAME_REGISTRY.map((g: { id: string }) => ({
    id: g.id,
  }));
}

export async function generateMetadata({ params }: GameDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const game = GAME_REGISTRY.find((g: { id: string }) => g.id === id);
  
  return {
    title: game ? `Settings — ${game.titleKey}` : 'Game Settings',
    description: `Configure settings for ${id}.`,
  };
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { id } = await params;

  const isValid = GAME_REGISTRY.some((g: { id: string }) => g.id === id);

  if (!isValid) notFound();

  // For simplicity, we default to difficulty setting if not specified
  return <GameSettingsPage settingType="difficulty" gameType={id} />;
}
