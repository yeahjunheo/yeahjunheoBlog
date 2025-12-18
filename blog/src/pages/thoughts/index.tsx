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

      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <header className="mb-12">
            <Link href="/" className="inline-flex items-center text-cyan hover:text-coral font-medium transition-colors duration-200 mb-6 group">
              <span className="group-hover:-translate-x-1 transition-transform duration-200">&larr;</span>
              <span className="ml-2">Back to Home</span>
            </Link>
            <h1 className="text-5xl font-bold mb-4 text-purple">
              Thoughts
            </h1>
            <p className="text-xl text-text-secondary">
              Personal reflections and musings on various topics
            </p>
            <div className="h-1 w-32 bg-orange mt-4 rounded-full"></div>
          </header>

          <div className="grid gap-6">
            {posts.length === 0 ? (
              <div className="bg-surface rounded-lg shadow-md p-12 text-center border-t-4 border-orange">
                <div className="text-6xl mb-6">💭</div>
                <p className="text-xl text-text-primary mb-2">No thoughts yet.</p>
                <p className="text-text-secondary">Check back soon for personal reflections and insights!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article key={post.slug} className="bg-surface rounded-lg shadow-md p-6 border-l-4 border-orange hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                  <Link href={`/thoughts/${post.slug}`}>
                    <h2 className="text-2xl font-bold text-purple hover:text-orange transition-colors duration-200 mb-3">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="flex gap-4 text-sm text-text-secondary mb-4">
                    <time dateTime={post.date} className="flex items-center gap-1">
                      <span className="text-orange">●</span> {post.date}
                    </time>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-coral">●</span> {post.readingTime}
                    </span>
                  </div>
                  {post.description && (
                    <p className="text-text-primary">{post.description}</p>
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
