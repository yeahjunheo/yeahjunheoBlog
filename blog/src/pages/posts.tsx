import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useState, useMemo } from 'react';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import GroupedPostsGrid from '@/components/GroupedPostsGrid';
import TimelineScroller from '@/components/TimelineScroller';
import { Search } from 'lucide-react';

interface PostsPageProps {
  allPosts: PostMetadata[];
}

export default function PostsPage({ allPosts }: PostsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Extract all unique difficulties from posts
  const difficulties = useMemo(() => {
    const diffSet = new Set<string>();
    allPosts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (['easy', 'medium', 'hard'].includes(lowerTag)) {
            diffSet.add(lowerTag);
          }
        });
      }
    });
    return Array.from(diffSet).sort();
  }, [allPosts]);

  // Filter posts based on search and difficulty
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      // Search filter
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' ||
                                post.tags?.some(tag => tag.toLowerCase() === selectedDifficulty);

      return matchesSearch && matchesDifficulty;
    });
  }, [allPosts, searchQuery, selectedDifficulty]);

  const handleTimelineClick = (_periodKey: string) => {
    // Timeline handles its own scrolling
    // This is just a callback if we need to do anything else
  };

  return (
    <>
      <Head>
        <title>All Posts | yeahjunheo</title>
        <meta name="description" content="Browse all blog posts" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Timeline Scroller - Fixed on right side */}
        <TimelineScroller posts={filteredPosts} onPeriodClick={handleTimelineClick} />

        {/* Centered Content */}
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h1 className="text-4xl font-bold text-text-primary mb-8">All Posts</h1>

          {/* Filters Section */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary h-5 w-5" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg
                         text-text-primary placeholder:text-text-secondary
                         focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent
                         transition-all"
              />
            </div>

            {/* Difficulty Filter */}
            {difficulties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedDifficulty === 'all'
                      ? 'bg-purple text-white'
                      : 'bg-surface text-text-secondary hover:bg-purple/10 hover:text-purple'
                  }`}
                >
                  All
                </button>
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                      selectedDifficulty === difficulty
                        ? 'bg-purple text-white'
                        : 'bg-surface text-text-secondary hover:bg-purple/10 hover:text-purple'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-text-secondary">
            Showing {filteredPosts.length} of {allPosts.length} posts
          </div>

          {/* Posts Grid - Grouped by date */}
          <GroupedPostsGrid
            posts={filteredPosts}
            groupByDate={true}
          />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async () => {
  const allPosts = getAllPosts();

  return {
    props: {
      allPosts,
    },
  };
};
