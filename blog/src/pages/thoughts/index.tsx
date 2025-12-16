import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllPosts, PostMetadata } from '@/lib/markdown';

interface ThoughtsPageProps {
  posts: PostMetadata[];
}

export default function ThoughtsPage({ posts }: ThoughtsPageProps) {
  return (
    <>
      <Head>
        <title>Thoughts | yeahjunheo</title>
        <meta name="description" content="Personal thoughts, reflections, and musings" />
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <header className="mb-12">
            <Link href="/" className="text-sm hover:underline mb-4 inline-block">
              ê Home
            </Link>
            <h1 className="text-4xl font-bold mb-2">Thoughts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Personal reflections and musings on various topics
            </p>
          </header>

          {/* Posts list */}
          <div className="space-y-8">
            {posts.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">No posts yet. Check back soon!</p>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="border-b border-gray-200 dark:border-gray-800 pb-8">
                  <Link href={`/thoughts/${post.slug}`}>
                    <h2 className="text-2xl font-semibold mb-2 hover:underline">{post.title}</h2>
                  </Link>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>"</span>
                    <span>{post.readingTime}</span>
                  </div>
                  {post.description && (
                    <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<ThoughtsPageProps> = async () => {
  const posts = getAllPosts('thoughts');

  return {
    props: {
      posts,
    },
  };
};
