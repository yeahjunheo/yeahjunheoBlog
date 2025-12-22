import PostCard from '@/components/PostCard';
import type { PostMetadata } from '@/lib/markdown';
import { useMemo } from 'react';

interface GroupedPostsGridProps {
  posts: PostMetadata[];
  groupByDate?: boolean;
}

interface GroupedPosts {
  [yearMonth: string]: PostMetadata[];
}

export default function GroupedPostsGrid({
  posts,
  groupByDate = false
}: GroupedPostsGridProps) {

  // Group posts by year-month
  const groupedPosts = useMemo(() => {
    if (!groupByDate) return null;

    const grouped: GroupedPosts = {};
    posts.forEach(post => {
      // Extract year and month from date string (e.g., "December 22, 2025")
      const dateMatch = post.date.match(/(\w+)\s+\d+,\s+(\d{4})/);
      if (dateMatch) {
        const month = dateMatch[1];
        const year = dateMatch[2];
        const key = `${year}-${month}`;

        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(post);
      }
    });

    return grouped;
  }, [posts, groupByDate]);

  // Sort year-month keys in descending order
  const sortedKeys = useMemo(() => {
    if (!groupedPosts) return [];

    return Object.keys(groupedPosts).sort((a, b) => {
      const [yearA, monthA] = a.split('-');
      const [yearB, monthB] = b.split('-');

      if (yearA !== yearB) {
        return parseInt(yearB) - parseInt(yearA);
      }

      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames.indexOf(monthB) - monthNames.indexOf(monthA);
    });
  }, [groupedPosts]);

  // If not grouping by date, render simple grid
  if (!groupByDate || !groupedPosts) {
    return (
      <div className="max-w-5xl">
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <section className="text-center py-20">
            <div className="bg-surface shadow-2xl p-12 border-t-8 border-purple">
              <div className="text-8xl mb-6">📝</div>
              <p className="text-3xl font-bold text-text-primary mb-4">
                No posts found
              </p>
              <p className="text-lg text-text-secondary mb-6">
                Try adjusting your filters
              </p>
            </div>
          </section>
        )}
      </div>
    );
  }

  // Render grouped by date
  return (
    <div className="space-y-12">
      {sortedKeys.length === 0 ? (
        <section className="text-center py-20">
          <div className="bg-surface shadow-2xl p-12 border-t-8 border-purple">
            <div className="text-8xl mb-6">📝</div>
            <p className="text-3xl font-bold text-text-primary mb-4">
              No posts found
            </p>
            <p className="text-lg text-text-secondary mb-6">
              Try adjusting your filters
            </p>
          </div>
        </section>
      ) : (
        sortedKeys.map(key => {
          const [year, month] = key.split('-');
          const postsInPeriod = groupedPosts[key];

          return (
            <div
              key={key}
              id={key}
            >
              {/* Date Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-text-primary">
                  {month} {year}
                </h2>
                <div className="h-1 w-20 bg-purple mt-2 rounded-full" />
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postsInPeriod.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
