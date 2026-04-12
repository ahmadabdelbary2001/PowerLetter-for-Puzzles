import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search & Discovery',
  description: 'Search for games, lessons, and learning paths across the platform.',
};

export default function SearchPage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search</h1>
      <div className="max-w-2xl mx-auto">
        {/* TODO: Integrate SearchBar molecule and searchStore */}
        <div className="relative mb-8">
          <input 
            type="search" 
            placeholder="Search for 'Animals', 'Spelling', 'Puzzles'..." 
            className="w-full rounded-full border bg-background px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">Trending Searches</p>
          <div className="flex flex-wrap gap-2">
            {['Crosswords', 'Kids Mode', 'Vocabulary', 'Arabic Alphabet'].map(term => (
              <button key={term} className="rounded-full bg-secondary px-4 py-2 text-sm hover:bg-secondary/80 transition-colors">
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
