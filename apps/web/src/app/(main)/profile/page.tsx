import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Profile',
  description: 'View your progress, statistics, and earned achievements.',
};

export default function ProfilePage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-6 mb-12">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
          U
        </div>
        <div>
          <h1 className="text-3xl font-bold">User Profile</h1>
          <p className="text-muted-foreground">Linguist Apprentice</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-secondary/50 border text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Words Learned</p>
          <p className="text-3xl font-bold">128</p>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/50 border text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Games Won</p>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="p-6 rounded-2xl bg-secondary/50 border text-center">
          <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Current Streak</p>
          <p className="text-3xl font-bold">5 Days</p>
        </div>
      </div>
    </section>
  );
}
