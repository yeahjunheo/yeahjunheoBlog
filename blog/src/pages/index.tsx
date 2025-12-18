import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import PostCard from '@/components/PostCard';
import HeroBanner from '@/components/HeroBanner';

interface HomeProps {
  allPosts: PostMetadata[];
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>yeahjunheo | Portfolio & Blog</title>
        <meta name="description" content="Personal blog and portfolio of yeahjunheo" />
      </Head>

      <div className="min-h-screen bg-background">
        <HeroBanner />

        <div className="max-w-5xl mx-auto px-6 pb-16">
          {/* All Posts Grid - Randomized */}
          {allPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
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
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Get all posts in chronological order (newest first)
  const allPosts = getAllPosts();

  return {
    props: {
      allPosts,
    },
  };
};
