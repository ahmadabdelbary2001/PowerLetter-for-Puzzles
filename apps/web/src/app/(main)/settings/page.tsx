import type { Metadata } from 'next';
import { GameSettingsPage } from '@powerletter/ui';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Customize your experience — language, difficulty, and accessibility.',
};

export default function SettingsPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>
      {/* TODO: Extend GameSettingsPage to handle global platform settings */}
      <GameSettingsPage />
    </section>
  );
}
