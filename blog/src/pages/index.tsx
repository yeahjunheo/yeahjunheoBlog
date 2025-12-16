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

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <header className="mb-16">
            <h1 className="text-5xl font-bold mb-4">Hi, I'm yeahjunheo</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              Software engineer, problem solver, and lifelong learner.
            </p>
            <nav className="flex gap-6">
              <Link href="/code" className="hover:underline font-medium">
                Code
              </Link>
              <Link href="/thoughts" className="hover:underline font-medium">
                Thoughts
              </Link>
              <Link href="/me" className="hover:underline font-medium">
                About Me
              </Link>
            </nav>
          </header>

          {/* Recent Code Posts */}
          {recentCodePosts.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Code</h2>
                <Link href="/code" className="text-sm hover:underline">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {recentCodePosts.map((post) => (
                  <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                    <Link href={`/code/${post.slug}`}>
                      <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
                    </Link>
                    <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <time dateTime={post.date}>{post.date}</time>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Recent Thoughts */}
          {recentThoughts.length > 0 && (
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Thoughts</h2>
                <Link href="/thoughts" className="text-sm hover:underline">
                  View all →
                </Link>
              </div>
              <div className="space-y-4">
                {recentThoughts.map((post) => (
                  <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-4">
                    <Link href={`/thoughts/${post.slug}`}>
                      <h3 className="text-lg font-semibold hover:underline">{post.title}</h3>
                    </Link>
                    <div className="flex gap-3 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <time dateTime={post.date}>{post.date}</time>
                      <span>•</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {recentCodePosts.length === 0 && recentThoughts.length === 0 && (
            <section className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No posts yet. Check back soon!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Add markdown files to <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">content/code/</code> or{' '}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">content/thoughts/</code>
              </p>
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
      recentCodePosts: codePosts.slice(0, 3), // Show 3 most recent
      recentThoughts: thoughts.slice(0, 3),
    },
  };
};
