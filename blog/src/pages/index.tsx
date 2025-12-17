import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getAllPosts, PostMetadata } from '@/lib/markdown';

interface HomeProps {
  recentCodePosts: PostMetadata[];
  recentThoughts: PostMetadata[];
}

export default function Home({ recentCodePosts, recentThoughts }: HomeProps) {
  return (
    <>
      <Head>
        <title>yeahjunheo | Portfolio & Blog</title>
        <meta name="description" content="Personal blog and portfolio of yeahjunheo" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Hero Section with colorful background */}
        <div className="bg-linear-to-br from-purple via-purple-dark to-navy text-cream-light py-20 mb-16">
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

          {/* Recent Code Posts */}
          {recentCodePosts.length > 0 && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-text-primary flex items-center gap-3">
                  <span className="text-cyan text-5xl">&lt;</span>
                  <span className="text-cyan">Recent Code</span>
                  <span className="text-cyan text-5xl">/&gt;</span>
                </h2>
                <Link href="/code" className="px-4 py-2 bg-cyan text-cream-light rounded-lg hover:bg-cyan-dark font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                  View all <span>&rarr;</span>
                </Link>
              </div>
              <div className="grid gap-6">
                {recentCodePosts.map((post) => (
                  <article key={post.slug} className="bg-surface rounded-xl shadow-lg p-6 border-l-8 border-cyan hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                    <Link href={`/code/${post.slug}`}>
                      <h3 className="text-2xl font-bold text-text-primary hover:text-cyan transition-colors duration-200 mb-3">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex gap-4 text-sm font-medium mb-3">
                      <time dateTime={post.date} className="flex items-center gap-2 text-orange-dark">
                        <span className="text-xl">📅</span> {post.date}
                      </time>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-2 text-coral-dark">
                        <span className="text-xl">⏱️</span> {post.readingTime}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-text-primary text-base mt-3 leading-relaxed">{post.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Recent Thoughts */}
          {recentThoughts.length > 0 && (
            <section className="mb-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-bold text-text-primary flex items-center gap-3">
                  <span className="text-5xl">💭</span>
                  <span className="text-coral">Recent Thoughts</span>
                </h2>
                <Link href="/thoughts" className="px-4 py-2 bg-coral text-cream-light rounded-lg hover:bg-coral-dark font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                  View all <span>&rarr;</span>
                </Link>
              </div>
              <div className="grid gap-6">
                {recentThoughts.map((post) => (
                  <article key={post.slug} className="bg-surface rounded-xl shadow-lg p-6 border-l-8 border-coral hover:shadow-2xl hover:-translate-y-1 transition-all duration-200">
                    <Link href={`/thoughts/${post.slug}`}>
                      <h3 className="text-2xl font-bold text-text-primary hover:text-coral transition-colors duration-200 mb-3">
                        {post.title}
                      </h3>
                    </Link>
                    <div className="flex gap-4 text-sm font-medium mb-3">
                      <time dateTime={post.date} className="flex items-center gap-2 text-orange-dark">
                        <span className="text-xl">📅</span> {post.date}
                      </time>
                      <span className="text-border">•</span>
                      <span className="flex items-center gap-2 text-coral-dark">
                        <span className="text-xl">⏱️</span> {post.readingTime}
                      </span>
                    </div>
                    {post.description && (
                      <p className="text-text-primary text-base mt-3 leading-relaxed">{post.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {recentCodePosts.length === 0 && recentThoughts.length === 0 && (
            <section className="text-center py-20">
              <div className="bg-surface rounded-2xl shadow-2xl p-12 border-t-8 border-purple">
                <div className="text-8xl mb-6 animate-bounce">📝</div>
                <p className="text-3xl font-bold text-text-primary mb-4">
                  No posts yet. Check back soon!
                </p>
                <p className="text-lg text-text-secondary mb-6">
                  The journey begins...
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <code className="bg-cyan text-cream-light px-4 py-2 rounded-lg font-mono font-bold shadow-md">content/code/</code>
                  <span className="text-3xl text-text-primary">+</span>
                  <code className="bg-coral text-cream-light px-4 py-2 rounded-lg font-mono font-bold shadow-md">content/thoughts/</code>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const codePosts = getAllPosts('code');
  const thoughts = getAllPosts('thoughts');

  return {
    props: {
      recentCodePosts: codePosts.slice(0, 3),
      recentThoughts: thoughts.slice(0, 3),
    },
  };
};
