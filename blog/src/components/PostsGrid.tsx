import PostCard from '@/components/PostCard';
import type { PostMetadata } from '@/lib/markdown';

interface PostsGridProps {
  posts: PostMetadata[];
}

export default function PostsGrid({ posts }: PostsGridProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
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
              No posts yet. Check back soon!
            </p>
            <p className="text-lg text-text-secondary mb-6">
              The journey begins...
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
