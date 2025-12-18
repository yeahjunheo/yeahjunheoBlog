import Head from 'next/head';
import { GetStaticProps } from 'next';
import { getAllPosts, PostMetadata } from '@/lib/markdown';
import PostCard from '@/components/PostCard';

interface HomeProps {
  allPosts: Array<PostMetadata & { category: 'code' | 'thoughts' }>;
}

export default function Home({ allPosts }: HomeProps) {
  return (
    <>
      <Head>
        <title>yeahjunheo | Portfolio & Blog</title>
        <meta name="description" content="Personal blog and portfolio of yeahjunheo" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Hero Section with colorful background */}
        <div className="bg-purple text-cream-light py-20 mb-16">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg text-cream-light">
                Hi, I am <span className="text-yellow">Yeahjun Heo</span>
              </h1>
              <p className="text-2xl text-cream-light mb-6 max-w-3xl mx-auto">
                Software engineer, problem solver, and lifelong learner.
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <span className="px-4 py-2 bg-cyan rounded-full text-cream-light font-semibold shadow-lg hover:bg-cyan-light transition-colors duration-200">💻 Developer</span>
                <span className="px-4 py-2 bg-coral rounded-full text-cream-light font-semibold shadow-lg hover:bg-coral-light transition-colors duration-200">🚀 Builder</span>
                <span className="px-4 py-2 bg-orange rounded-full text-cream-light font-semibold shadow-lg hover:bg-orange-light transition-colors duration-200">🎯 Problem Solver</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-16">
          {/* All Posts Grid - Randomized */}
          {allPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPosts.map((post) => (
                <PostCard key={`${post.category}-${post.slug}`} post={post} category={post.category} />
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
  const codePosts = getAllPosts('code').map(post => ({ ...post, category: 'code' as const }));
  const thoughts = getAllPosts('thoughts').map(post => ({ ...post, category: 'thoughts' as const }));

  // Combine all posts
  const allPosts = [...codePosts, ...thoughts];

  // Randomize the order
  const shuffled = allPosts.sort(() => Math.random() - 0.5);

  return {
    props: {
      allPosts: shuffled,
    },
  };
};
